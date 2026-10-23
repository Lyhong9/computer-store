package com.example.computer_ecommerce.customer.dto;

public record CustomerResponse(
        Long id,
        Long userId,
        String username,
        String email,
        String firstName,
        String lastName,
        String phone) {
}
