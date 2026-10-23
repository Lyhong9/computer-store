package com.example.computer_ecommerce.sales.controller;

import com.example.computer_ecommerce.sales.dto.SaleRequest;
import com.example.computer_ecommerce.sales.dto.SaleResponse;
import com.example.computer_ecommerce.sales.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService sales;

    public SaleController(SaleService sales) {
        this.sales = sales;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public SaleResponse create(
            @Valid @RequestBody SaleRequest request,
            Authentication authentication) {
        return sales.create(request, authentication);
    }
}
