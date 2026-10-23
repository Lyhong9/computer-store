package com.example.computer_ecommerce.customer.service;

import com.example.computer_ecommerce.customer.dto.CustomerRequest;
import com.example.computer_ecommerce.customer.dto.CustomerResponse;
import com.example.computer_ecommerce.customer.entity.Customer;
import com.example.computer_ecommerce.customer.repository.CustomerRepository;
import com.example.computer_ecommerce.user.entity.AppUser;
import com.example.computer_ecommerce.user.repository.AppUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customers;
    private final AppUserRepository users;

    public CustomerService(CustomerRepository customers, AppUserRepository users) {
        this.customers = customers;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> findAll() {
        return customers.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CustomerResponse findById(Long id) {
        return toResponse(getCustomer(id));
    }

    @Transactional(readOnly = true)
    public CustomerResponse findByUsername(String username) {
        Customer customer = customers.findByUserUsername(username)
                .or(() -> customers.findByUserEmail(username))
                .orElseThrow(() -> new IllegalArgumentException("Customer profile not found for: " + username));
        return toResponse(customer);
    }

    public CustomerResponse getOrCreateCurrentCustomer(String username) {
        return customers.findByUserUsername(username)
                .or(() -> customers.findByUserEmail(username))
                .map(this::toResponse)
                .orElseGet(() -> {
                    AppUser user = users.findByUsername(username)
                            .or(() -> users.findByEmail(username))
                            .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

                    Customer customer = new Customer(
                            user,
                            user.getUsername(),
                            "",
                            null,
                            null,
                            null
                    );
                    return toResponse(customers.save(customer));
                });
    }

    public CustomerResponse updateCurrentCustomer(String username, CustomerRequest request) {
        Customer customer = customers.findByUserUsername(username)
                .or(() -> customers.findByUserEmail(username))
                .orElseGet(() -> {
                    AppUser user = users.findByUsername(username)
                            .or(() -> users.findByEmail(username))
                            .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
                    Customer newCustomer = new Customer(user, request.firstName(), request.lastName(), request.phone());
                    return customers.save(newCustomer);
                });

        if (request.firstName() != null && !request.firstName().isBlank()) {
            customer.setFirstName(request.firstName().trim());
        }
        if (request.lastName() != null) {
            customer.setLastName(request.lastName().trim());
        }
        if (request.phone() != null) {
            customer.setPhone(normalize(request.phone()));
        }
        if (request.address() != null) {
            customer.setAddress(normalize(request.address()));
        }
        if (request.city() != null) {
            customer.setCity(normalize(request.city()));
        }

        return toResponse(customers.save(customer));
    }

    public CustomerResponse create(CustomerRequest request) {
        AppUser user = getOptionalUser(request.userId());
        if (user != null) {
            ensureUserIsNotAssigned(user.getId(), null);
        }

        Customer customer = new Customer(
                user,
                request.firstName().trim(),
                request.lastName().trim(),
                normalize(request.phone()),
                normalize(request.address()),
                normalize(request.city()));

        return toResponse(customers.save(customer));
    }

    public CustomerResponse update(Long id, CustomerRequest request) {
        Customer customer = getCustomer(id);
        AppUser user = getOptionalUser(request.userId());
        if (user != null) {
            ensureUserIsNotAssigned(user.getId(), id);
        }

        customer.setUser(user);
        customer.setFirstName(request.firstName().trim());
        customer.setLastName(request.lastName().trim());
        customer.setPhone(normalize(request.phone()));
        customer.setAddress(normalize(request.address()));
        customer.setCity(normalize(request.city()));

        return toResponse(customer);
    }

    public void delete(Long id) {
        customers.delete(getCustomer(id));
    }

    private Customer getCustomer(Long id) {
        return customers.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + id));
    }

    private AppUser getOptionalUser(Long userId) {
        if (userId == null) {
            return null;
        }

        return users.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    }

    private void ensureUserIsNotAssigned(Long userId, Long currentCustomerId) {
        customers.findByUserId(userId).ifPresent(existing -> {
            if (!existing.getId().equals(currentCustomerId)) {
                throw new IllegalArgumentException("User is already assigned to a customer");
            }
        });
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private CustomerResponse toResponse(Customer customer) {
        AppUser user = customer.getUser();
        return new CustomerResponse(
                customer.getId(),
                user == null ? null : user.getId(),
                user == null ? null : user.getUsername(),
                user == null ? null : user.getEmail(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getCity());
    }
}
