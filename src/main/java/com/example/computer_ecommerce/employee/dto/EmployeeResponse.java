package com.example.computer_ecommerce.employee.dto;

public record EmployeeResponse(
        Long id,
        Long userId,
        String username,
        String email,
        String firstName,
        String lastName,
        String jobTitle) {
}
