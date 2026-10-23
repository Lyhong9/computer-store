package com.example.computer_ecommerce.user.service;

import com.example.computer_ecommerce.common.enums.Role;
import com.example.computer_ecommerce.customer.entity.Customer;
import com.example.computer_ecommerce.customer.repository.CustomerRepository;
import com.example.computer_ecommerce.employee.entity.Employee;
import com.example.computer_ecommerce.employee.repository.EmployeeRepository;
import com.example.computer_ecommerce.user.dto.UserResponse;
import com.example.computer_ecommerce.user.entity.AppUser;
import com.example.computer_ecommerce.user.repository.AppUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final AppUserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;

    public UserService(
            AppUserRepository userRepository,
            CustomerRepository customerRepository,
            EmployeeRepository employeeRepository
    ) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        return toResponse(user);
    }

    public UserResponse updateUserRole(Long id, String roleString) {
        if (roleString == null || roleString.isBlank()) {
            throw new IllegalArgumentException("Role name cannot be empty");
        }

        Role newRole;
        try {
            newRole = Role.valueOf(roleString.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + roleString + ". Supported roles: ADMIN, CUSTOMER, STAFF");
        }

        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        user.setRoles(Set.of(newRole));
        AppUser savedUser = userRepository.save(user);

        // Synchronize customer or employee entity based on new role
        if (newRole == Role.CUSTOMER) {
            Optional<Customer> existingCustomer = customerRepository.findByUserId(savedUser.getId());
            if (existingCustomer.isEmpty()) {
                String namePart = savedUser.getUsername() != null ? savedUser.getUsername() : "Customer";
                Customer newCust = new Customer(savedUser, namePart, "", "");
                customerRepository.save(newCust);
            }
        } else if (newRole == Role.ADMIN) {
            Optional<Employee> existingEmployee = employeeRepository.findByUserId(savedUser.getId());
            if (existingEmployee.isEmpty()) {
                String namePart = savedUser.getUsername() != null ? savedUser.getUsername() : "Admin";
                Employee newEmp = new Employee(savedUser, namePart, "User", "Administrator");
                employeeRepository.save(newEmp);
            }
        }

        log.info("Updated user {} (ID: {}) role to {}", savedUser.getUsername(), savedUser.getId(), newRole);
        return toResponse(savedUser);
    }

    private UserResponse toResponse(AppUser user) {
        String firstName = null;
        String lastName = null;
        String phone = null;

        Optional<Customer> customerOpt = customerRepository.findByUserId(user.getId());
        if (customerOpt.isPresent()) {
            Customer c = customerOpt.get();
            firstName = c.getFirstName();
            lastName = c.getLastName();
            phone = c.getPhone();
        } else {
            Optional<Employee> empOpt = employeeRepository.findByUserId(user.getId());
            if (empOpt.isPresent()) {
                Employee e = empOpt.get();
                firstName = e.getFirstName();
                lastName = e.getLastName();
            }
        }

        if (firstName == null && user.getUsername() != null) {
            firstName = user.getUsername();
        }

        String primaryRole = "CUSTOMER";
        if (user.getRoles().contains(Role.ADMIN)) {
            primaryRole = "ADMIN";
        } else if (user.getRoles().contains(Role.STAFF)) {
            primaryRole = "STAFF";
        } else if (user.getRoles().contains(Role.CUSTOMER)) {
            primaryRole = "CUSTOMER";
        }

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                firstName,
                lastName,
                phone,
                primaryRole,
                user.getRoles(),
                user.isEnabled(),
                user.getId() != null ? java.time.Instant.now() : null,
                java.time.Instant.now()
        );
    }
}
