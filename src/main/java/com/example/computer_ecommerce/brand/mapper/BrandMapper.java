package com.example.computer_ecommerce.brand.mapper;

import com.example.computer_ecommerce.brand.dto.BrandRequest;
import com.example.computer_ecommerce.brand.dto.BrandResponse;
import com.example.computer_ecommerce.brand.dto.BrandSummaryResponse;
import com.example.computer_ecommerce.brand.entity.Brand;
import com.example.computer_ecommerce.category.dto.CategorySummaryResponse;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class BrandMapper {

    public Brand toEntity(BrandRequest request) {
        Brand brand = new Brand();
        updateEntity(brand, request);
        return brand;
    }

    public void updateEntity(Brand brand, BrandRequest request) {
        brand.setName(request.name().trim());
        brand.setDescription(request.description());
    }

    public BrandResponse toResponse(Brand brand) {
        Set<CategorySummaryResponse> categories = brand.getCategories() == null
                ? Collections.emptySet()
                : brand.getCategories().stream()
                .map(c -> new CategorySummaryResponse(c.getId(), c.getName()))
                .collect(Collectors.toSet());

        return new BrandResponse(
                brand.getId(),
                brand.getName(),
                brand.getDescription(),
                brand.isActive(),
                categories);
    }

    public BrandSummaryResponse toSummaryResponse(Brand brand) {
        return new BrandSummaryResponse(brand.getId(), brand.getName());
    }
}
