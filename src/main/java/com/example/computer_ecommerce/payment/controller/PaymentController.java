package com.example.computer_ecommerce.payment.controller;

import com.example.computer_ecommerce.payment.aba.AbaPaywayService;
import com.example.computer_ecommerce.payment.dto.BakongQrResponse;
import com.example.computer_ecommerce.payment.dto.PaymentVerificationResponse;
import com.example.computer_ecommerce.payment.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // --- BAKONG KHQR ENDPOINTS ---

    @PostMapping("/bakong/generate/{orderNumber}")
    @ResponseStatus(HttpStatus.CREATED)
    public BakongQrResponse generateBakongQr(@PathVariable String orderNumber) {
        return paymentService.generateBakongQr(orderNumber);
    }

    @PostMapping("/bakong/check-status")
    public PaymentVerificationResponse checkBakongStatus(
            @RequestParam String orderNumber,
            @RequestParam(required = false) String md5Hash,
            @RequestParam(required = false, defaultValue = "false") boolean userCheck
    ) {
        return paymentService.verifyBakongPayment(orderNumber, md5Hash, userCheck);
    }

    // --- ABA PAYWAY ENDPOINTS ---

    @PostMapping("/aba/create-checkout/{orderNumber}")
    @ResponseStatus(HttpStatus.CREATED)
    public AbaPaywayService.AbaCheckoutPayload createAbaCheckout(
            @PathVariable String orderNumber,
            @RequestParam(required = false) String paymentOption,
            @RequestParam(required = false) String frontendBaseUrl
    ) {
        return paymentService.createAbaCheckout(orderNumber, paymentOption, frontendBaseUrl);
    }

    @PostMapping("/aba/check-status/{orderNumber}")
    public PaymentVerificationResponse checkAbaStatus(
            @PathVariable String orderNumber,
            @RequestParam(required = false, defaultValue = "false") boolean userCheck
    ) {
        return paymentService.verifyAbaPayment(orderNumber, userCheck);
    }

    // --- SIMULATED TEST PAYMENT (DEVELOPMENT / DEMO ACCELERATOR) ---

    @PostMapping("/simulate-success")
    public PaymentVerificationResponse simulatePaymentSuccess(
            @RequestParam String orderNumber,
            @RequestParam(defaultValue = "BAKONG_KHQR") String gateway
    ) {
        return paymentService.simulatePaymentSuccess(orderNumber, gateway);
    }
}
