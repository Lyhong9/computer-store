package com.example.computer_ecommerce.brand.repository;

import com.example.computer_ecommerce.brand.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    Optional<Brand> findByName(String name);

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    @Query("SELECT b FROM Brand b LEFT JOIN FETCH b.categories WHERE b.id = :id")
    Optional<Brand> findByIdWithCategories(@Param("id") Long id);

    @Query("SELECT DISTINCT b FROM Brand b LEFT JOIN FETCH b.categories")
    List<Brand> findAllWithCategories();

    @Query("SELECT b FROM Brand b JOIN b.categories c WHERE c.id = :categoryId")
    List<Brand> findByCategoryId(@Param("categoryId") Long categoryId);
}
