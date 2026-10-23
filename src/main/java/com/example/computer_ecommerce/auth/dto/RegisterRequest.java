package com.example.computer_ecommerce.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 100) String username,
        @NotBlank @Email @Size(max = 255) String email,
        String password,
        String firstName,
        String lastName,
        String phone,
        String role) {
}