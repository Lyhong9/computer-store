package com.example.computer_ecommerce.user.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateRoleRequest(
        @NotBlank(message = "Role is required (ADMIN or CUSTOMER)")
        String role
) {
}
