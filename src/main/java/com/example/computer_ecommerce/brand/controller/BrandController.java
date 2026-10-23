package com.example.computer_ecommerce.brand.controller;

import com.example.computer_ecommerce.brand.dto.BrandRequest;
import com.example.computer_ecommerce.brand.dto.BrandResponse;
import com.example.computer_ecommerce.brand.service.BrandService;
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
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandService brands;

    public BrandController(BrandService brands) {
        this.brands = brands;
    }

    @GetMapping
    public List<BrandResponse> findAll() {
        return brands.findAll();
    }

    @GetMapping("/{id}")
    public BrandResponse findById(@PathVariable Long id) {
        return brands.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public BrandResponse create(@Valid @RequestBody BrandRequest request) {
        return brands.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public BrandResponse update(
            @PathVariable Long id,
            @Valid @RequestBody BrandRequest request) {
        return brands.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        brands.delete(id);
    }
}
