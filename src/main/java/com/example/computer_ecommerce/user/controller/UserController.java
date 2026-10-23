package com.example.computer_ecommerce.user.controller;

import com.example.computer_ecommerce.user.dto.UpdateRoleRequest;
import com.example.computer_ecommerce.user.dto.UserResponse;
import com.example.computer_ecommerce.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PatchMapping("/{id}/role")
    public UserResponse updateRolePatch(@PathVariable Long id, @Valid @RequestBody UpdateRoleRequest request) {
        return userService.updateUserRole(id, request.role());
    }

    @PutMapping("/{id}/role")
    public UserResponse updateRolePut(@PathVariable Long id, @Valid @RequestBody UpdateRoleRequest request) {
        return userService.updateUserRole(id, request.role());
    }
}
