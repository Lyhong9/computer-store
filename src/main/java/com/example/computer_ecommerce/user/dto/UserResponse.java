package com.example.computer_ecommerce.user.dto;

import com.example.computer_ecommerce.common.enums.Role;

import java.time.Instant;
import java.util.Set;

public record UserResponse(
        Long id,
        String username,
        String email,
        String firstName,
        String lastName,
        String phone,
        String role,
        Set<Role> roles,
        boolean enabled,
        Instant createdAt,
        Instant updatedAt
) {
}
