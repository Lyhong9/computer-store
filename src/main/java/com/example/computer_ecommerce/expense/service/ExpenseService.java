package com.example.computer_ecommerce.expense.service;

import com.example.computer_ecommerce.expense.dto.ExpenseRequest;
import com.example.computer_ecommerce.expense.dto.ExpenseResponse;
import com.example.computer_ecommerce.expense.entity.Expense;
import com.example.computer_ecommerce.expense.mapper.ExpenseMapper;
import com.example.computer_ecommerce.expense.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenses;
    private final ExpenseMapper mapper;

    public ExpenseService(ExpenseRepository expenses, ExpenseMapper mapper) {
        this.expenses = expenses;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> findAll(String category, LocalDate startDate, LocalDate endDate) {
        List<Expense> result;
        boolean hasCategory = category != null && !category.isBlank();
        boolean hasDateRange = startDate != null && endDate != null;

        if (hasCategory && hasDateRange) {
            result = expenses.findByCategoryIgnoreCaseAndExpenseDateBetween(category.trim(), startDate, endDate);
        } else if (hasCategory) {
            result = expenses.findByCategoryIgnoreCase(category.trim());
        } else if (hasDateRange) {
            result = expenses.findByExpenseDateBetween(startDate, endDate);
        } else {
            result = expenses.findAll();
        }

        return result.stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ExpenseResponse findById(Long id) {
        return mapper.toResponse(getExpense(id));
    }

    public ExpenseResponse create(ExpenseRequest request) {
        Expense expense = mapper.toEntity(request);
        return mapper.toResponse(expenses.save(expense));
    }

    public ExpenseResponse update(Long id, ExpenseRequest request) {
        Expense expense = getExpense(id);
        mapper.updateEntity(expense, request);
        return mapper.toResponse(expense);
    }

    public void delete(Long id) {
        expenses.delete(getExpense(id));
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotal(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return expenses.sumTotalAmountBetween(startDate, endDate);
        }
        return expenses.sumTotalAmount();
    }

    private Expense getExpense(Long id) {
        return expenses.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found: " + id));
    }
}
