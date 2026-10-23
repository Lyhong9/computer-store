package com.example.computer_ecommerce.auth.service;

import com.example.computer_ecommerce.auth.dto.AuthResponse;
import com.example.computer_ecommerce.auth.dto.LoginRequest;
import com.example.computer_ecommerce.auth.dto.RegisterRequest;
import com.example.computer_ecommerce.common.enums.Role;
import com.example.computer_ecommerce.customer.entity.Customer;
import com.example.computer_ecommerce.customer.repository.CustomerRepository;
import com.example.computer_ecommerce.security.JwtService;
import com.example.computer_ecommerce.user.entity.AppUser;
import com.example.computer_ecommerce.user.repository.AppUserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AppUserRepository users;
    private final CustomerRepository customers;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            AuthenticationManager authenticationManager,
            AppUserRepository users,
            CustomerRepository customers,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.users = users;
        this.customers = customers;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        // Support login with either username or email
        AppUser user = users.findByUsername(request.username())
                .or(() -> users.findByEmail(request.username()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(), request.password()));

        return toAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(String identifier) {
        AppUser user = users.findByUsername(identifier)
                .or(() -> users.findByEmail(identifier))
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + identifier));

        return toAuthResponse(user);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Check if user already exists by username or email
        AppUser existingUser = users.findByUsername(request.username())
                .or(() -> users.findByEmail(request.email()))
                .orElse(null);

        if (existingUser != null) {
            // Ensure customer record exists if role is customer
            if (existingUser.getRoles().contains(Role.CUSTOMER)) {
                customers.findByUserId(existingUser.getId()).orElseGet(() -> {
                    String fName = (request.firstName() != null && !request.firstName().isBlank())
                            ? request.firstName()
                            : existingUser.getUsername();
                    String lName = (request.lastName() != null) ? request.lastName() : "";
                    return customers.save(new Customer(existingUser, fName, lName, request.phone()));
                });
            }
            return toAuthResponse(existingUser);
        }

        // 2. Resolve Role (defaults to CUSTOMER)
        Role role = Role.CUSTOMER;
        if (request.role() != null && !request.role().isBlank()) {
            try {
                role = Role.valueOf(request.role().toUpperCase());
            } catch (IllegalArgumentException ignored) {
                role = Role.CUSTOMER;
            }
        }

        // 3. Encode password
        String rawPassword = (request.password() != null && !request.password().isBlank())
                ? request.password()
                : UUID.randomUUID().toString();
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 4. Create and save AppUser
        AppUser newUser = new AppUser(
                request.username(),
                encodedPassword,
                request.email(),
                Set.of(role)
        );
        AppUser savedUser = users.save(newUser);

        // 5. Create associated Customer record if customer role
        if (role == Role.CUSTOMER) {
            String fName = (request.firstName() != null && !request.firstName().isBlank())
                    ? request.firstName()
                    : request.username();
            String lName = (request.lastName() != null) ? request.lastName() : "";
            Customer customer = new Customer(savedUser, fName, lName, request.phone());
            customers.save(customer);
        }

        return toAuthResponse(savedUser);
    }

    private AuthResponse toAuthResponse(AppUser user) {
        Customer customer = customers.findByUserId(user.getId()).orElse(null);
        String fName = customer != null ? customer.getFirstName() : user.getUsername();
        String lName = customer != null ? customer.getLastName() : "";
        String phone = customer != null ? customer.getPhone() : null;
        Long customerId = customer != null ? customer.getId() : null;

        Set<String> roleNames = user.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());
        String primaryRole = roleNames.stream().findFirst().orElse("CUSTOMER");

        return new AuthResponse(
                jwtService.generateToken(user.getUsername()),
                user.getUsername(),
                user.getEmail(),
                primaryRole,
                roleNames,
                customerId,
                fName,
                lName,
                phone);
    }
}
