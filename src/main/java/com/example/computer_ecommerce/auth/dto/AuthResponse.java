package com.example.computer_ecommerce.auth.dto;

import java.util.Set;

public record AuthResponse(
        String token,
        String username,
        String email,
        String role,
        Set<String> roles,
        Long customerId,
        String firstName,
        String lastName,
        String phone) {

    public AuthResponse(String token, String username, String role) {
        this(token, username, null, role, Set.of(role), null, null, null, null);
    }
}
