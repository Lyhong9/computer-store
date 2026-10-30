package com.example.computer_ecommerce.category.controller;

import com.example.computer_ecommerce.category.dto.CategoryRequest;
import com.example.computer_ecommerce.category.dto.CategoryResponse;
import com.example.computer_ecommerce.category.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categories;

    public CategoryController(CategoryService categories) {
        this.categories = categories;
    }

    @GetMapping
    public List<CategoryResponse> findAll() {
        return categories.findAll();
    }

    @GetMapping("/{id}")
    public CategoryResponse findById(@PathVariable Long id) {
        return categories.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(@Valid @RequestBody CategoryRequest request) {
        return categories.create(request);
    }

    @PutMapping("/{id}")
    public CategoryResponse update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        return categories.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        categories.delete(id);
    }

    @PostMapping("/{id}/brands/{brandId}")
    public CategoryResponse addBrand(
            @PathVariable Long id,
            @PathVariable Long brandId) {
        return categories.addBrand(id, brandId);
    }

    @DeleteMapping("/{id}/brands/{brandId}")
    public CategoryResponse removeBrand(
            @PathVariable Long id,
            @PathVariable Long brandId) {
        return categories.removeBrand(id, brandId);
    }
}
