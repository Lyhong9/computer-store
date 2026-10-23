package com.example.computer_ecommerce.category.mapper;

import com.example.computer_ecommerce.brand.dto.BrandSummaryResponse;
import com.example.computer_ecommerce.category.dto.CategoryRequest;
import com.example.computer_ecommerce.category.dto.CategoryResponse;
import com.example.computer_ecommerce.category.dto.CategorySummaryResponse;
import com.example.computer_ecommerce.category.entity.Category;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryRequest request) {
        Category category = new Category();
        updateEntity(category, request);
        return category;
    }

    public void updateEntity(Category category, CategoryRequest request) {
        category.setName(request.name().trim());
        category.setDescription(request.description());
    }

    public CategoryResponse toResponse(Category category) {
        Set<BrandSummaryResponse> brands = category.getBrands() == null
                ? Collections.emptySet()
                : category.getBrands().stream()
                .map(b -> new BrandSummaryResponse(b.getId(), b.getName()))
                .collect(Collectors.toSet());

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.isActive(),
                brands);
    }

    public CategorySummaryResponse toSummaryResponse(Category category) {
        return new CategorySummaryResponse(category.getId(), category.getName());
    }
}
