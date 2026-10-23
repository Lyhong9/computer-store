package com.example.computer_ecommerce.inventory.dto;

public record InventoryResponse(
        Long productId,
        String sku,
        String productName,
        Integer quantityOnHand,
        boolean active) {
}
