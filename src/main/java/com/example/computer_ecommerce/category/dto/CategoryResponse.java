package com.example.computer_ecommerce.category.dto;

import com.example.computer_ecommerce.brand.dto.BrandSummaryResponse;

import java.util.Set;

public record CategoryResponse(
        Long id,
        String name,
        String description,
        boolean active,
        Set<BrandSummaryResponse> brands) {
}
