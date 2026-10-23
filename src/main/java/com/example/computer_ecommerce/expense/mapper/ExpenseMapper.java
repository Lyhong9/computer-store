package com.example.computer_ecommerce.expense.mapper;

import com.example.computer_ecommerce.expense.dto.ExpenseRequest;
import com.example.computer_ecommerce.expense.dto.ExpenseResponse;
import com.example.computer_ecommerce.expense.entity.Expense;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ExpenseMapper {

    public Expense toEntity(ExpenseRequest request) {
        Expense expense = new Expense();
        updateEntity(expense, request);
        return expense;
    }

    public void updateEntity(Expense expense, ExpenseRequest request) {
        expense.setTitle(request.title().trim());
        expense.setCategory(request.category().trim());
        expense.setAmount(request.amount());
        expense.setExpenseDate(request.expenseDate() != null ? request.expenseDate() : LocalDate.now());
        expense.setPaymentMethod(normalize(request.paymentMethod()));
        expense.setReferenceNumber(normalize(request.referenceNumber()));
        expense.setDescription(normalize(request.description()));
    }

    public ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getCategory(),
                expense.getAmount(),
                expense.getExpenseDate(),
                expense.getPaymentMethod(),
                expense.getReferenceNumber(),
                expense.getDescription(),
                expense.getCreatedAt(),
                expense.getUpdatedAt());
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
