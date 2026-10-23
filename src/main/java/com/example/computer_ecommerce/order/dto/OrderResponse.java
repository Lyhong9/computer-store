package com.example.computer_ecommerce.order.dto;

import com.example.computer_ecommerce.order.entity.OrderStatus;
import com.example.computer_ecommerce.payment.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        String id,
        String orderNumber,
        Instant createdAt,
        String customerName,
        String customerEmail,
        String customerPhone,
        String shippingAddress,
        String paymentMethod,
        PaymentStatus paymentStatus,
        String paymentTransactionId,
        Instant paidAt,
        BigDecimal subtotal,
        BigDecimal tax,
        BigDecimal shipping,
        BigDecimal total,
        OrderStatus status,
        List<OrderItemResponse> items) {

    public OrderResponse(
            String id,
            String orderNumber,
            Instant createdAt,
            String customerName,
            String customerEmail,
            String customerPhone,
            String shippingAddress,
            String paymentMethod,
            BigDecimal subtotal,
            BigDecimal tax,
            BigDecimal shipping,
            BigDecimal total,
            OrderStatus status,
            List<OrderItemResponse> items) {
        this(id, orderNumber, createdAt, customerName, customerEmail, customerPhone, shippingAddress,
                paymentMethod, PaymentStatus.PENDING, null, null, subtotal, tax, shipping, total, status, items);
    }

    public record OrderItemResponse(
            Long productId,
            String productName,
            String productSku,
            String productImage,
            BigDecimal price,
            int quantity,
            BigDecimal totalPrice) {
    }
}
