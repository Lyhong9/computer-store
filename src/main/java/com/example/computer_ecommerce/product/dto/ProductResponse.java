package com.example.computer_ecommerce.product.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProductResponse(
        Long id,
        String sku,
        String name,
        String description,
        BigDecimal price,
        BigDecimal originalPrice,
        String primaryImage,
        List<String> images,
        boolean featured,
        String badge,
        BigDecimal rating,
        Integer reviewCount,
        Integer quantityOnHand,
        boolean active,
        Long categoryId,
        String categoryName,
        Long brandId,
        String brandName) {
}
