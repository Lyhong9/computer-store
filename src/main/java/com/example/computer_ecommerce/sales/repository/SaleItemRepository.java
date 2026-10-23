package com.example.computer_ecommerce.sales.repository;

import com.example.computer_ecommerce.sales.entity.SaleItem;
import com.example.computer_ecommerce.sales.entity.SaleItemId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleItemRepository extends JpaRepository<SaleItem, SaleItemId> {
}
