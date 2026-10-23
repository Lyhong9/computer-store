package com.example.computer_ecommerce.customer.controller;

import com.example.computer_ecommerce.customer.dto.CustomerRequest;
import com.example.computer_ecommerce.customer.dto.CustomerResponse;
import com.example.computer_ecommerce.customer.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customers;

    public CustomerController(CustomerService customers) {
        this.customers = customers;
    }

    @GetMapping("/me")
    public CustomerResponse getCurrentCustomer(
            Principal principal,
            @RequestHeader(value = "X-User-Username", required = false) String headerUsername,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail) {
        String username = resolveUsername(principal, headerUsername, headerEmail);
        return customers.getOrCreateCurrentCustomer(username);
    }

    @PutMapping("/me")
    public CustomerResponse updateCurrentCustomer(
            Principal principal,
            @RequestHeader(value = "X-User-Username", required = false) String headerUsername,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @Valid @RequestBody CustomerRequest request) {
        String username = resolveUsername(principal, headerUsername, headerEmail);
        return customers.updateCurrentCustomer(username, request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<CustomerResponse> findAll() {
        return customers.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public CustomerResponse findById(@PathVariable Long id) {
        return customers.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public CustomerResponse create(@Valid @RequestBody CustomerRequest request) {
        return customers.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CustomerResponse update(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequest request) {
        return customers.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        customers.delete(id);
    }

    private String resolveUsername(Principal principal, String headerUsername, String headerEmail) {
        if (principal != null && principal.getName() != null && !principal.getName().isBlank()) {
            return principal.getName();
        }
        if (headerUsername != null && !headerUsername.isBlank()) {
            return headerUsername.trim();
        }
        if (headerEmail != null && !headerEmail.isBlank()) {
            return headerEmail.trim();
        }
        throw new IllegalArgumentException("No authenticated user identity provided");
    }
}
