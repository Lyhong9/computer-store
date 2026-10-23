package com.example.computer_ecommerce.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank @Size(max = 100) String sku,
        @NotBlank @Size(max = 255) String name,
        String description,
        @NotNull @DecimalMin("0.00") BigDecimal price,
        @NotNull @Min(0) Integer quantityOnHand,
        Long categoryId,
        Long brandId) {
}
