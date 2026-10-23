package com.example.computer_ecommerce.sales.service;

import com.example.computer_ecommerce.customer.entity.Customer;
import com.example.computer_ecommerce.customer.repository.CustomerRepository;
import com.example.computer_ecommerce.employee.repository.EmployeeRepository;
import com.example.computer_ecommerce.product.entity.Product;
import com.example.computer_ecommerce.product.repository.ProductRepository;
import com.example.computer_ecommerce.sales.dto.SaleRequest;
import com.example.computer_ecommerce.sales.dto.SaleResponse;
import com.example.computer_ecommerce.sales.entity.Sale;
import com.example.computer_ecommerce.sales.entity.SaleItem;
import com.example.computer_ecommerce.sales.entity.SaleStatus;
import com.example.computer_ecommerce.sales.repository.SaleRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class SaleService {

    private final SaleRepository sales;
    private final ProductRepository products;
    private final CustomerRepository customers;
    private final EmployeeRepository employees;

    public SaleService(
            SaleRepository sales,
            ProductRepository products,
            CustomerRepository customers,
            EmployeeRepository employees) {
        this.sales = sales;
        this.products = products;
        this.customers = customers;
        this.employees = employees;
    }

    @Transactional
    public SaleResponse create(SaleRequest request, Authentication authentication) {
        // The employee is derived from the authenticated account; the client cannot
        // create a sale under another employee's identity.
        employees.findByUserUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Authenticated user is not linked to an employee"));

        Customer customer = customers.findById(request.customerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + request.customerId()));

        Map<Long, Integer> requestedQuantities = aggregateItems(request);

        Sale sale = new Sale();
        sale.setCustomer(customer);
        sale.setStatus(SaleStatus.COMPLETED);
        sale.setCreatedAt(Instant.now());
        sale.setTotalAmount(BigDecimal.ZERO);
        sales.saveAndFlush(sale);

        BigDecimal total = BigDecimal.ZERO;
        var responseItems = new ArrayList<SaleResponse.Item>();

        // IDs are processed in a stable order to reduce deadlocks when two sales
        // contain overlapping products in different request orders.
        for (var entry : requestedQuantities.entrySet()) {
            Product product = products.findByIdForUpdate(entry.getKey())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + entry.getKey()));

            int quantity = entry.getValue();
            if (!product.isActive()) {
                throw new IllegalArgumentException("Product is inactive: " + product.getName());
            }
            if (product.getQuantityOnHand() < quantity) {
                throw new IllegalArgumentException("Insufficient stock: " + product.getName());
            }

            BigDecimal unitPrice = product.getPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(quantity));

            sale.addItem(new SaleItem(product, quantity, unitPrice));
            product.setQuantityOnHand(product.getQuantityOnHand() - quantity);
            total = total.add(subtotal);

            responseItems.add(new SaleResponse.Item(
                    product.getId(),
                    product.getName(),
                    quantity,
                    unitPrice,
                    subtotal));
        }

        sale.setTotalAmount(total);
        sales.save(sale);

        return new SaleResponse(sale.getId(), sale.getCreatedAt(), total, responseItems);
    }

    private Map<Long, Integer> aggregateItems(SaleRequest request) {
        Map<Long, Integer> quantities = new LinkedHashMap<>();
        request.items().stream()
                .sorted((left, right) -> Long.compare(left.productId(), right.productId()))
                .forEach(item -> quantities.merge(item.productId(), item.quantity(), Math::addExact));
        return quantities;
    }
}
