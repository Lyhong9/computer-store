package com.example.computer_ecommerce.order.controller;

import com.example.computer_ecommerce.order.dto.CheckoutRequest;
import com.example.computer_ecommerce.order.dto.OrderResponse;
import com.example.computer_ecommerce.order.entity.OrderStatus;
import com.example.computer_ecommerce.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orders;

    public OrderController(OrderService orders) {
        this.orders = orders;
    }

    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse checkout(@Valid @RequestBody CheckoutRequest request) {
        return orders.checkout(request);
    }

    @GetMapping("/{orderNumber}")
    public OrderResponse findByOrderNumber(@PathVariable String orderNumber) {
        return orders.findByOrderNumber(orderNumber);
    }

    @GetMapping("/by-email")
    public List<OrderResponse> findByCustomerEmail(@RequestParam String email) {
        return orders.findByCustomerEmail(email);
    }

    @GetMapping
    public Page<OrderResponse> findAll(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return orders.findAll(pageable);
    }

    @PatchMapping("/{orderNumber}/status")
    public OrderResponse updateStatus(
            @PathVariable String orderNumber,
            @RequestParam OrderStatus status) {
        return orders.updateStatus(orderNumber, status);
    }
}
