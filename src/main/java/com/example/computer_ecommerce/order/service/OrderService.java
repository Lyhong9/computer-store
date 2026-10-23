package com.example.computer_ecommerce.order.service;

import com.example.computer_ecommerce.order.dto.CheckoutRequest;
import com.example.computer_ecommerce.order.dto.OrderResponse;
import com.example.computer_ecommerce.order.entity.CustomerOrder;
import com.example.computer_ecommerce.order.entity.CustomerOrderItem;
import com.example.computer_ecommerce.order.entity.OrderStatus;
import com.example.computer_ecommerce.order.repository.CustomerOrderRepository;
import com.example.computer_ecommerce.product.entity.Product;
import com.example.computer_ecommerce.product.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Transactional
public class OrderService {

    private final CustomerOrderRepository orders;
    private final ProductRepository products;

    public OrderService(CustomerOrderRepository orders, ProductRepository products) {
        this.orders = orders;
        this.products = products;
    }

    public OrderResponse checkout(CheckoutRequest request) {
        CustomerOrder order = new CustomerOrder();

        String datePrefix = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randSuffix = ThreadLocalRandom.current().nextInt(1000, 9999);
        String orderNumber = "ORD-" + datePrefix + "-" + randSuffix;

        order.setOrderNumber(orderNumber);
        order.setCustomerName(request.customerName());
        order.setCustomerEmail(request.customerEmail());
        order.setCustomerPhone(request.customerPhone());
        order.setShippingAddress(request.shippingAddress());
        order.setPaymentMethod(request.paymentMethod() != null ? request.paymentMethod() : "BAKONG_KHQR");
        order.setPaymentStatus(com.example.computer_ecommerce.payment.entity.PaymentStatus.PENDING);
        order.setStatus(OrderStatus.CONFIRMED);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CheckoutRequest.OrderItemRequest itemReq : request.items()) {
            Product product = products.findByIdForUpdate(itemReq.productId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + itemReq.productId()));

            if (product.getQuantityOnHand() < itemReq.quantity()) {
                throw new IllegalStateException("Insufficient stock for product: " + product.getName()
                        + " (Available: " + product.getQuantityOnHand() + ", Requested: " + itemReq.quantity() + ")");
            }

            // Deduct stock
            product.setQuantityOnHand(product.getQuantityOnHand() - itemReq.quantity());

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity()));
            subtotal = subtotal.add(itemTotal);

            CustomerOrderItem item = new CustomerOrderItem();
            item.setProduct(product);
            item.setProductName(product.getName());
            item.setProductSku(product.getSku());
            item.setProductImage(product.getPrimaryImage());
            item.setUnitPrice(product.getPrice());
            item.setQuantity(itemReq.quantity());
            item.setTotalPrice(itemTotal);

            order.addItem(item);
        }

        BigDecimal taxRate = new BigDecimal("0.08"); // 8% sales tax
        BigDecimal tax = subtotal.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal shipping = subtotal.compareTo(new BigDecimal("99.00")) >= 0 ? BigDecimal.ZERO : new BigDecimal("15.00");
        BigDecimal total = subtotal.add(tax).add(shipping);

        order.setSubtotal(subtotal);
        order.setTax(tax);
        order.setShipping(shipping);
        order.setTotal(total);

        CustomerOrder saved = orders.save(order);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public OrderResponse findByOrderNumber(String orderNumber) {
        CustomerOrder order = orders.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with number: " + orderNumber));
        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findByCustomerEmail(String email) {
        return orders.findByCustomerEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> findAll(Pageable pageable) {
        return orders.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toResponse);
    }

    public OrderResponse updateStatus(String orderNumber, OrderStatus status) {
        CustomerOrder order = orders.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));
        order.setStatus(status);
        return toResponse(order);
    }

    private OrderResponse toResponse(CustomerOrder order) {
        List<OrderResponse.OrderItemResponse> itemResponses = order.getItems().stream()
                .map(i -> new OrderResponse.OrderItemResponse(
                        i.getProduct() != null ? i.getProduct().getId() : null,
                        i.getProductName(),
                        i.getProductSku(),
                        i.getProductImage(),
                        i.getUnitPrice(),
                        i.getQuantity(),
                        i.getTotalPrice()))
                .toList();

        return new OrderResponse(
                order.getOrderNumber(),
                order.getOrderNumber(),
                order.getCreatedAt(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getCustomerPhone(),
                order.getShippingAddress(),
                order.getPaymentMethod(),
                order.getPaymentStatus() != null ? order.getPaymentStatus() : com.example.computer_ecommerce.payment.entity.PaymentStatus.PENDING,
                order.getPaymentTransactionId(),
                order.getPaidAt(),
                order.getSubtotal(),
                order.getTax(),
                order.getShipping(),
                order.getTotal(),
                order.getStatus(),
                itemResponses);
    }
}

