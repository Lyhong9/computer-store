package com.example.computer_ecommerce.inventory.service;

import com.example.computer_ecommerce.inventory.dto.InventoryRequest;
import com.example.computer_ecommerce.inventory.dto.InventoryResponse;
import com.example.computer_ecommerce.inventory.dto.InventoryUpdateRequest;
import com.example.computer_ecommerce.product.entity.Product;
import com.example.computer_ecommerce.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class InventoryService {

    private final ProductRepository products;

    public InventoryService(ProductRepository products) {
        this.products = products;
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> findAll() {
        return products.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public InventoryResponse findByProductId(Long productId) {
        return toResponse(getProduct(productId));
    }

    public InventoryResponse create(InventoryRequest request) {
        Product product = getProductForUpdate(request.productId());
        product.setQuantityOnHand(request.quantityOnHand());
        return toResponse(product);
    }

    public InventoryResponse update(Long productId, InventoryUpdateRequest request) {
        Product product = getProductForUpdate(productId);
        product.setQuantityOnHand(request.quantityOnHand());
        return toResponse(product);
    }

    public void delete(Long productId) {
        Product product = getProductForUpdate(productId);
        product.setQuantityOnHand(0);
    }

    private Product getProduct(Long productId) {
        return products.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
    }

    private Product getProductForUpdate(Long productId) {
        return products.findByIdForUpdate(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
    }

    private InventoryResponse toResponse(Product product) {
        return new InventoryResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getQuantityOnHand(),
                product.isActive());
    }
}
