package com.example.computer_ecommerce.order.repository;

import com.example.computer_ecommerce.order.entity.CustomerOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {

    Optional<CustomerOrder> findByOrderNumber(String orderNumber);

    List<CustomerOrder> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);

    Page<CustomerOrder> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
