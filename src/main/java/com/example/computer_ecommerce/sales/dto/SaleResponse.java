package com.example.computer_ecommerce.sales.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record SaleResponse(
        Long saleId,
        Instant saleDate,
        BigDecimal totalAmount,
        List<Item> items) {

    public record Item(
            Long productId,
            String productName,
            Integer quantity,
            BigDecimal unitPrice,
            BigDecimal subtotal) {
    }
}
