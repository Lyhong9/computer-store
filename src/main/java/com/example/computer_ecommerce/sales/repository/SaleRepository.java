package com.example.computer_ecommerce.sales.repository;

import com.example.computer_ecommerce.sales.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}
