package com.example.computer_ecommerce.inventory.controller;

import com.example.computer_ecommerce.inventory.dto.InventoryRequest;
import com.example.computer_ecommerce.inventory.dto.InventoryResponse;
import com.example.computer_ecommerce.inventory.dto.InventoryUpdateRequest;
import com.example.computer_ecommerce.inventory.service.InventoryService;
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
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventory;

    public InventoryController(InventoryService inventory) {
        this.inventory = inventory;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<InventoryResponse> findAll() {
        return inventory.findAll();
    }

    @GetMapping("/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public InventoryResponse findByProductId(@PathVariable Long productId) {
        return inventory.findByProductId(productId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public InventoryResponse create(@Valid @RequestBody InventoryRequest request) {
        return inventory.create(request);
    }

    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public InventoryResponse update(
            @PathVariable Long productId,
            @Valid @RequestBody InventoryUpdateRequest request) {
        return inventory.update(productId, request);
    }

    @DeleteMapping("/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long productId) {
        inventory.delete(productId);
    }
}
