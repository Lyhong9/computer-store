package com.example.computer_ecommerce.auth.dto;

public record AuthResponse(
        String token,
        String username,
        String role) {
}
