package com.example.computer_ecommerce.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        @NotBlank @Size(max = 100) String sku,
        @NotBlank @Size(max = 255) String name,
        String description,
        @NotNull @DecimalMin("0.00") BigDecimal price,
        BigDecimal originalPrice,
        String primaryImage,
        List<String> images,
        Boolean featured,
        String badge,
        BigDecimal rating,
        Integer reviewCount,
        @NotNull @Min(0) Integer quantityOnHand,
        Long categoryId,
        Long brandId) {

    // Overloaded constructor for backwards compatibility with tests and simpler calls
    public ProductRequest(
            String sku,
            String name,
            String description,
            BigDecimal price,
            Integer quantityOnHand,
            Long categoryId,
            Long brandId) {
        this(sku, name, description, price, null, null, null, false, null, BigDecimal.valueOf(5.0), 0, quantityOnHand, categoryId, brandId);
    }
}
