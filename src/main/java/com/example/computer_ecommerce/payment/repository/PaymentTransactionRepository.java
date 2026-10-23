package com.example.computer_ecommerce.payment.repository;

import com.example.computer_ecommerce.payment.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    Optional<PaymentTransaction> findByTransactionId(String transactionId);

    Optional<PaymentTransaction> findByMd5Hash(String md5Hash);

    List<PaymentTransaction> findByOrderNumberOrderByCreatedAtDesc(String orderNumber);

    Optional<PaymentTransaction> findFirstByOrderNumberOrderByCreatedAtDesc(String orderNumber);
}
