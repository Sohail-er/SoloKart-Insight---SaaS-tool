package com.solokart.service;

import org.springframework.data.domain.Pageable;

import com.solokart.io.OrderRequest;
import com.solokart.io.OrderResponse;
import com.solokart.io.PaymentVerificationRequest;
import com.solokart.io.SalesByUserResponse;

import java.time.LocalDate;
import java.util.List;

public interface OrderService {

    OrderResponse createOrder(OrderRequest request);

    void deleteOrder(String orderId);

    List<OrderResponse> getLatestOrders();

    OrderResponse verifyPayment(PaymentVerificationRequest request);

    Double sumSalesByDate(LocalDate date);

    Long countByOrderDate(LocalDate date);

    List<OrderResponse> findRecentOrders();

    List<SalesByUserResponse> getTotalSalesGroupedByUser();
}
