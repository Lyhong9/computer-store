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
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(), request.password()));

        var user = users.findByUsername(request.username())
                .orElseThrow();

        String role = user.getRoles().stream()
                .findFirst()
                .map(Enum::name)
                .orElseThrow(() -> new IllegalStateException("User has no assigned role"));

        return new AuthResponse(
                jwtService.generateToken(user.getUsername()),
                user.getUsername(),
                role);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Check if user already exists by username or email
        AppUser existingUser = users.findByUsername(request.username())
                .or(() -> users.findByEmail(request.email()))
                .orElse(null);

        if (existingUser != null) {
            String roleName = existingUser.getRoles().stream()
                    .findFirst()
                    .map(Enum::name)
                    .orElse("CUSTOMER");

            return new AuthResponse(
                    jwtService.generateToken(existingUser.getUsername()),
                    existingUser.getUsername(),
                    roleName);
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

        return new AuthResponse(
                jwtService.generateToken(savedUser.getUsername()),
                savedUser.getUsername(),
                role.name());
    }
}
