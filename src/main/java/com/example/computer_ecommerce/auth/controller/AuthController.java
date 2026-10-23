package com.example.computer_ecommerce.auth.controller;

import com.example.computer_ecommerce.auth.dto.AuthResponse;
import com.example.computer_ecommerce.auth.dto.LoginRequest;
import com.example.computer_ecommerce.auth.dto.RegisterRequest;
import com.example.computer_ecommerce.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/sync-user")
    public AuthResponse syncUser(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @GetMapping("/me")
    public AuthResponse getCurrentUser(
            Principal principal,
            @RequestHeader(value = "X-User-Username", required = false) String headerUsername,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail) {
        String identifier = null;
        if (principal != null && principal.getName() != null && !principal.getName().isBlank()) {
            identifier = principal.getName();
        } else if (headerUsername != null && !headerUsername.isBlank()) {
            identifier = headerUsername.trim();
        } else if (headerEmail != null && !headerEmail.isBlank()) {
            identifier = headerEmail.trim();
        }

        if (identifier == null) {
            throw new IllegalArgumentException("No authenticated user identity provided");
        }

        return authService.getCurrentUser(identifier);
    }
}
