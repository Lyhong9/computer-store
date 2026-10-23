package com.example.computer_ecommerce.category.repository;

import com.example.computer_ecommerce.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.brands WHERE c.id = :id")
    Optional<Category> findByIdWithBrands(@Param("id") Long id);

    @Query("SELECT DISTINCT c FROM Category c LEFT JOIN FETCH c.brands")
    List<Category> findAllWithBrands();
}
