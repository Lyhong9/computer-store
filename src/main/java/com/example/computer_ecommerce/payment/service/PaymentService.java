package com.example.computer_ecommerce.payment.service;

import com.example.computer_ecommerce.order.entity.CustomerOrder;
import com.example.computer_ecommerce.order.entity.OrderStatus;
import com.example.computer_ecommerce.order.repository.CustomerOrderRepository;
import com.example.computer_ecommerce.payment.aba.AbaPaywayService;
import com.example.computer_ecommerce.payment.config.PaymentProperties;
import com.example.computer_ecommerce.payment.dto.BakongQrResponse;
import com.example.computer_ecommerce.payment.dto.PaymentVerificationResponse;
import com.example.computer_ecommerce.payment.entity.PaymentStatus;
import com.example.computer_ecommerce.payment.entity.PaymentTransaction;
import com.example.computer_ecommerce.payment.khqr.BakongApiClient;
import com.example.computer_ecommerce.payment.khqr.KhqrGenerator;
import com.example.computer_ecommerce.payment.repository.PaymentTransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final CustomerOrderRepository orderRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final KhqrGenerator khqrGenerator;
    private final BakongApiClient bakongApiClient;
    private final AbaPaywayService abaPaywayService;
    private final PaymentProperties paymentProperties;

    public PaymentService(
            CustomerOrderRepository orderRepository,
            PaymentTransactionRepository transactionRepository,
            KhqrGenerator khqrGenerator,
            BakongApiClient bakongApiClient,
            AbaPaywayService abaPaywayService,
            PaymentProperties paymentProperties
    ) {
        this.orderRepository = orderRepository;
        this.transactionRepository = transactionRepository;
        this.khqrGenerator = khqrGenerator;
        this.bakongApiClient = bakongApiClient;
        this.abaPaywayService = abaPaywayService;
        this.paymentProperties = paymentProperties;
    }

    public BakongQrResponse generateBakongQr(String orderNumber) {
        CustomerOrder order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with number: " + orderNumber));

        PaymentProperties.BakongProperties bakongProps = paymentProperties.getBakong();

        KhqrGenerator.KhqrResult qrResult = khqrGenerator.generateIndividualKhqr(
                bakongProps.getAccountId(),
                bakongProps.getAccountName(),
                bakongProps.getMerchantCity(),
                bakongProps.getMerchantPhone(),
                bakongProps.getStoreLabel(),
                order.getOrderNumber(),
                order.getTotal(),
                "USD"
        );

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setTransactionId("BKG-" + qrResult.md5Hash().substring(0, 16));
        transaction.setOrderNumber(order.getOrderNumber());
        transaction.setPaymentGateway("BAKONG_KHQR");
        transaction.setAmount(order.getTotal());
        transaction.setCurrency("USD");
        transaction.setStatus(PaymentStatus.PENDING);
        transaction.setQrString(qrResult.qrString());
        transaction.setMd5Hash(qrResult.md5Hash());

        transactionRepository.save(transaction);

        order.setPaymentMethod("BAKONG_KHQR");
        order.setPaymentTransactionId(qrResult.md5Hash());
        orderRepository.save(order);

        log.info("Generated Bakong KHQR for order {}: MD5={}, Amount={}", order.getOrderNumber(), qrResult.md5Hash(), order.getTotal());

        return new BakongQrResponse(
                order.getOrderNumber(),
                order.getTotal(),
                "USD",
                bakongProps.getAccountId(),
                bakongProps.getAccountName(),
                bakongProps.getStoreLabel(),
                qrResult.qrString(),
                qrResult.md5Hash(),
                qrResult.qrImageBase64()
        );
    }

    public PaymentVerificationResponse verifyBakongPayment(String orderNumber, String md5Hash) {
        CustomerOrder order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            return new PaymentVerificationResponse(
                    order.getOrderNumber(),
                    true,
                    PaymentStatus.PAID,
                    "BAKONG_KHQR",
                    order.getPaymentTransactionId(),
                    "Order is already paid"
            );
        }

        String targetMd5 = md5Hash;
        if (targetMd5 == null || targetMd5.isBlank()) {
            targetMd5 = order.getPaymentTransactionId();
        }

        if (targetMd5 == null || targetMd5.isBlank()) {
            Optional<PaymentTransaction> lastTx = transactionRepository.findFirstByOrderNumberOrderByCreatedAtDesc(orderNumber);
            if (lastTx.isPresent() && lastTx.get().getMd5Hash() != null) {
                targetMd5 = lastTx.get().getMd5Hash();
            }
        }

        if (targetMd5 == null || targetMd5.isBlank()) {
            return new PaymentVerificationResponse(
                    order.getOrderNumber(),
                    false,
                    order.getPaymentStatus(),
                    "BAKONG_KHQR",
                    null,
                    "No Bakong MD5 hash found for verification"
            );
        }

        BakongApiClient.BakongVerificationResult result = bakongApiClient.checkTransactionByMd5(targetMd5);

        if (result.isPaid()) {
            markOrderPaid(order, "BAKONG_KHQR", result.transactionHash() != null ? result.transactionHash() : targetMd5, result.rawJson());

            Optional<PaymentTransaction> txOpt = transactionRepository.findByMd5Hash(targetMd5);
            if (txOpt.isPresent()) {
                PaymentTransaction tx = txOpt.get();
                tx.setStatus(PaymentStatus.PAID);
                tx.setGatewayRef(result.transactionHash());
                tx.setRawResponse(result.rawJson());
                transactionRepository.save(tx);
            }

            return new PaymentVerificationResponse(
                    order.getOrderNumber(),
                    true,
                    PaymentStatus.PAID,
                    "BAKONG_KHQR",
                    result.transactionHash(),
                    "Payment confirmed via Bakong Open API"
            );
        }

        return new PaymentVerificationResponse(
                order.getOrderNumber(),
                false,
                PaymentStatus.PENDING,
                "BAKONG_KHQR",
                targetMd5,
                result.responseMessage() != null ? result.responseMessage() : "Waiting for payment"
        );
    }

    public AbaPaywayService.AbaCheckoutPayload createAbaCheckout(String orderNumber, String paymentOption, String frontendBaseUrl) {
        CustomerOrder order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));

        List<Map<String, Object>> items = new ArrayList<>();
        if (order.getItems() != null) {
            order.getItems().forEach(i -> {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("name", i.getProductName());
                itemMap.put("quantity", i.getQuantity());
                itemMap.put("price", i.getUnitPrice());
                items.add(itemMap);
            });
        }

        AbaPaywayService.AbaCheckoutPayload payload = abaPaywayService.createCheckoutPayload(
                order.getOrderNumber(),
                order.getTotal(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getCustomerPhone(),
                items,
                order.getShipping(),
                paymentOption,
                frontendBaseUrl
        );

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setTransactionId("ABA-" + order.getOrderNumber() + "-" + System.currentTimeMillis());
        transaction.setOrderNumber(order.getOrderNumber());
        transaction.setPaymentGateway("ABA_PAYWAY");
        transaction.setAmount(order.getTotal());
        transaction.setCurrency("USD");
        transaction.setStatus(PaymentStatus.PENDING);
        transaction.setGatewayRef(payload.hash());

        transactionRepository.save(transaction);

        order.setPaymentMethod("ABA_PAYWAY");
        order.setPaymentTransactionId(payload.hash());
        orderRepository.save(order);

        return payload;
    }

    public PaymentVerificationResponse verifyAbaPayment(String orderNumber) {
        CustomerOrder order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            return new PaymentVerificationResponse(
                    order.getOrderNumber(),
                    true,
                    PaymentStatus.PAID,
                    "ABA_PAYWAY",
                    order.getPaymentTransactionId(),
                    "Order is already paid"
            );
        }

        AbaPaywayService.AbaCheckResult result = abaPaywayService.checkTransaction(order.getOrderNumber());

        if (result.isPaid()) {
            markOrderPaid(order, "ABA_PAYWAY", order.getOrderNumber(), result.rawJson());

            Optional<PaymentTransaction> txOpt = transactionRepository.findFirstByOrderNumberOrderByCreatedAtDesc(orderNumber);
            if (txOpt.isPresent()) {
                PaymentTransaction tx = txOpt.get();
                tx.setStatus(PaymentStatus.PAID);
                tx.setRawResponse(result.rawJson());
                transactionRepository.save(tx);
            }

            return new PaymentVerificationResponse(
                    order.getOrderNumber(),
                    true,
                    PaymentStatus.PAID,
                    "ABA_PAYWAY",
                    order.getOrderNumber(),
                    "Payment confirmed via ABA PayWay"
            );
        }

        return new PaymentVerificationResponse(
                order.getOrderNumber(),
                false,
                PaymentStatus.PENDING,
                "ABA_PAYWAY",
                order.getOrderNumber(),
                result.description() != null ? result.description() : "Waiting for ABA payment"
        );
    }

    public PaymentVerificationResponse simulatePaymentSuccess(String orderNumber, String gateway) {
        CustomerOrder order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));

        String selectedGateway = (gateway != null && !gateway.isBlank()) ? gateway.toUpperCase() : "BAKONG_KHQR";
        String mockTx = "SIMULATED-" + selectedGateway + "-" + System.currentTimeMillis();

        markOrderPaid(order, selectedGateway, mockTx, "{\"simulated\": true, \"note\": \"Dev test confirmation\"}");

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setTransactionId(mockTx);
        transaction.setOrderNumber(order.getOrderNumber());
        transaction.setPaymentGateway(selectedGateway);
        transaction.setAmount(order.getTotal());
        transaction.setCurrency("USD");
        transaction.setStatus(PaymentStatus.PAID);
        transaction.setGatewayRef(mockTx);
        transaction.setRawResponse("{\"simulated\": true}");
        transactionRepository.save(transaction);

        log.info("Simulated payment success for order {} via {}", orderNumber, selectedGateway);

        return new PaymentVerificationResponse(
                order.getOrderNumber(),
                true,
                PaymentStatus.PAID,
                selectedGateway,
                mockTx,
                "Test payment successfully confirmed!"
        );
    }

    private void markOrderPaid(CustomerOrder order, String gateway, String transactionRef, String details) {
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setPaymentMethod(gateway);
        order.setPaymentTransactionId(transactionRef);
        order.setPaidAt(Instant.now());
        order.setStatus(OrderStatus.CONFIRMED);
        if (details != null) {
            order.setPaymentDetails(details);
        }
        orderRepository.save(order);
    }
}
