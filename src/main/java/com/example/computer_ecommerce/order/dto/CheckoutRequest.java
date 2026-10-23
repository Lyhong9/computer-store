package com.example.computer_ecommerce.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CheckoutRequest(
        @NotBlank String customerName,
        @NotBlank @Email String customerEmail,
        String customerPhone,
        @NotBlank String shippingAddress,
        String paymentMethod,
        @NotEmpty List<@Valid OrderItemRequest> items) {

    public record OrderItemRequest(
            @NotNull Long productId,
            @NotNull Integer quantity) {
    }
}
