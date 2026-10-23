package com.example.computer_ecommerce.brand.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record BrandRequest(
        @NotBlank @Size(max = 100) String name,
        String description,
        Set<Long> categoryIds) {
}
