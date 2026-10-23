package com.example.computer_ecommerce.employee.repository;

import com.example.computer_ecommerce.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("select e from Employee e where e.user.username = :username")
    Optional<Employee> findByUserUsername(@Param("username") String username);

    @Query("select e from Employee e where e.user.id = :userId")
    Optional<Employee> findByUserId(@Param("userId") Long userId);
}
