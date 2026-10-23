package com.example.computer_ecommerce.expense.repository;

import com.example.computer_ecommerce.expense.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByCategoryIgnoreCase(String category);

    List<Expense> findByExpenseDateBetween(LocalDate startDate, LocalDate endDate);

    List<Expense> findByCategoryIgnoreCaseAndExpenseDateBetween(String category, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e")
    BigDecimal sumTotalAmount();

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalAmountBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
