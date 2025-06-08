package com.solokart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.solokart.entity.OrderItemEntity;

public interface OrderItemEntityRepository extends JpaRepository<OrderItemEntity, Long> {
}
