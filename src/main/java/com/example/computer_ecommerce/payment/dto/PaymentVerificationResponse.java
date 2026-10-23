package com.example.computer_ecommerce.payment.dto;

import com.example.computer_ecommerce.payment.entity.PaymentStatus;

public record PaymentVerificationResponse(
        String orderNumber,
        boolean isPaid,
        PaymentStatus paymentStatus,
        String paymentGateway,
        String transactionId,
        String message
) {}
