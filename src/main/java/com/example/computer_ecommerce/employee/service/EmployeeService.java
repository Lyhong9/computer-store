package com.example.computer_ecommerce.employee.service;

import com.example.computer_ecommerce.employee.dto.EmployeeRequest;
import com.example.computer_ecommerce.employee.dto.EmployeeResponse;
import com.example.computer_ecommerce.employee.entity.Employee;
import com.example.computer_ecommerce.employee.repository.EmployeeRepository;
import com.example.computer_ecommerce.user.entity.AppUser;
import com.example.computer_ecommerce.user.repository.AppUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employees;
    private final AppUserRepository users;

    public EmployeeService(EmployeeRepository employees, AppUserRepository users) {
        this.employees = employees;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> findAll() {
        return employees.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public EmployeeResponse findById(Long id) {
        return toResponse(getEmployee(id));
    }

    public EmployeeResponse create(EmployeeRequest request) {
        AppUser user = getUser(request.userId());
        ensureUserIsNotAssigned(user.getId(), null);

        Employee employee = new Employee(
                user,
                request.firstName().trim(),
                request.lastName().trim(),
                normalize(request.jobTitle()));

        return toResponse(employees.save(employee));
    }

    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee employee = getEmployee(id);
        AppUser user = getUser(request.userId());
        ensureUserIsNotAssigned(user.getId(), id);

        employee.setUser(user);
        employee.setFirstName(request.firstName().trim());
        employee.setLastName(request.lastName().trim());
        employee.setJobTitle(normalize(request.jobTitle()));

        return toResponse(employee);
    }

    public void delete(Long id) {
        employees.delete(getEmployee(id));
    }

    private Employee getEmployee(Long id) {
        return employees.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + id));
    }

    private AppUser getUser(Long id) {
        return users.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
    }

    private void ensureUserIsNotAssigned(Long userId, Long currentEmployeeId) {
        employees.findByUserId(userId).ifPresent(existing -> {
            if (!existing.getId().equals(currentEmployeeId)) {
                throw new IllegalArgumentException("User is already assigned to an employee");
            }
        });
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private EmployeeResponse toResponse(Employee employee) {
        AppUser user = employee.getUser();
        return new EmployeeResponse(
                employee.getId(),
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getJobTitle());
    }
}
