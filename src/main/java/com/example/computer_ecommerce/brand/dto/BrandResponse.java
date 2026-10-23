package com.example.computer_ecommerce.brand.dto;

import com.example.computer_ecommerce.category.dto.CategorySummaryResponse;

import java.util.Set;

public record BrandResponse(
        Long id,
        String name,
        String description,
        boolean active,
        Set<CategorySummaryResponse> categories) {
}
