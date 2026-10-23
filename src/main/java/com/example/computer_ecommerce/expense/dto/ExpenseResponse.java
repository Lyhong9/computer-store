package com.example.computer_ecommerce.expense.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record ExpenseResponse(
        Long id,
        String title,
        String category,
        BigDecimal amount,
        LocalDate expenseDate,
        String paymentMethod,
        String referenceNumber,
        String description,
        Instant createdAt,
        Instant updatedAt) {
}
