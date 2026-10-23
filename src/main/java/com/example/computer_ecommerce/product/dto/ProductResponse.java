package com.example.computer_ecommerce.product.dto;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String sku,
        String name,
        String description,
        BigDecimal price,
        Integer quantityOnHand,
        boolean active,
        Long categoryId,
        String categoryName,
        Long brandId,
        String brandName) {
}
