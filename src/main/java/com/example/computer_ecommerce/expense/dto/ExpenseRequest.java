package com.example.computer_ecommerce.expense.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRequest(
        @NotBlank @Size(max = 150) String title,
        @NotBlank @Size(max = 100) String category,
        @NotNull @DecimalMin("0.00") BigDecimal amount,
        LocalDate expenseDate,
        @Size(max = 50) String paymentMethod,
        @Size(max = 100) String referenceNumber,
        String description) {
}
