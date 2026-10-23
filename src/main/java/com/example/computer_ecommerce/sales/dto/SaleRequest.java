package com.example.computer_ecommerce.sales.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record SaleRequest(
        @NotNull Long customerId,
        @NotEmpty List<@Valid SaleItemRequest> items) {

    public record SaleItemRequest(
            @NotNull Long productId,
            @NotNull @Min(1) Integer quantity) {
    }
}
