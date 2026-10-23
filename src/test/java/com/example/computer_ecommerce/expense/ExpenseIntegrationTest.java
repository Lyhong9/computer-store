package com.example.computer_ecommerce.expense;

import com.example.computer_ecommerce.expense.dto.ExpenseRequest;
import com.example.computer_ecommerce.expense.dto.ExpenseResponse;
import com.example.computer_ecommerce.expense.service.ExpenseService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ExpenseIntegrationTest {

    @Autowired
    private ExpenseService expenseService;

    @Test
    void testExpenseCrudAndTotal() {
        // 1. Create expenses
        ExpenseResponse expense1 = expenseService.create(new ExpenseRequest(
                "Office Rent",
                "Rent",
                new BigDecimal("500.00"),
                LocalDate.of(2026, 10, 1),
                "BANK_TRANSFER",
                "RENT-OCT",
                "Monthly rent payment"
        ));
        assertNotNull(expense1.id());
        assertEquals("Office Rent", expense1.title());
        assertEquals("Rent", expense1.category());

        ExpenseResponse expense2 = expenseService.create(new ExpenseRequest(
                "Electricity Bill",
                "Utilities",
                new BigDecimal("150.00"),
                LocalDate.of(2026, 10, 15),
                "CASH",
                "ELEC-10",
                "Monthly electric bill"
        ));
        assertNotNull(expense2.id());

        // 2. Query all expenses
        List<ExpenseResponse> all = expenseService.findAll(null, null, null);
        assertEquals(2, all.size());

        // 3. Filter by category
        List<ExpenseResponse> utilities = expenseService.findAll("Utilities", null, null);
        assertEquals(1, utilities.size());
        assertEquals("Electricity Bill", utilities.get(0).title());

        // 4. Filter by date range
        List<ExpenseResponse> byDate = expenseService.findAll(
                null,
                LocalDate.of(2026, 10, 1),
                LocalDate.of(2026, 10, 10)
        );
        assertEquals(1, byDate.size());
        assertEquals("Office Rent", byDate.get(0).title());

        // 5. Total calculation
        BigDecimal total = expenseService.getTotal(null, null);
        assertEquals(new BigDecimal("650.00"), total);

        // 6. Update expense
        ExpenseResponse updated = expenseService.update(expense2.id(), new ExpenseRequest(
                "Electricity Bill",
                "Utilities",
                new BigDecimal("175.50"),
                LocalDate.of(2026, 10, 15),
                "CASH",
                "ELEC-10-UPDATED",
                "Updated amount"
        ));
        assertEquals(new BigDecimal("175.50"), updated.amount());

        // 7. Delete expense
        expenseService.delete(expense1.id());
        assertEquals(1, expenseService.findAll(null, null, null).size());
    }
}
