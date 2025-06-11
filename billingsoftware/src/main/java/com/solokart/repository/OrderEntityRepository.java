package com.solokart.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PathVariable;

import com.solokart.entity.OrderEntity;
import com.solokart.entity.UserEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;

@Repository
public interface OrderEntityRepository extends JpaRepository<OrderEntity, String> {

    Optional<OrderEntity> findByOrderId(String orderId);

    List<OrderEntity> findAllByOrderByCreatedAtDesc();

    @Query("SELECT SUM(o.grandTotal) FROM OrderEntity o WHERE DATE(o.createdAt) = :date")
    Double sumSalesByDate(@Param("date") LocalDate date);

    @Query("SELECT SUM(o.grandTotal) FROM OrderEntity o WHERE DATE(o.createdAt) = :date AND o.user = :user")
    Double sumSalesByDateAndUser(@Param("date") LocalDate date, @Param("user") UserEntity user);

    @Query("SELECT COUNT(o) FROM OrderEntity o WHERE DATE(o.createdAt) = :date")
    Long countByOrderDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(o) FROM OrderEntity o WHERE DATE(o.createdAt) = :date AND o.user = :user")
    Long countByOrderDateAndUser(@Param("date") LocalDate date, @Param("user") UserEntity user);

    @Query("SELECT o FROM OrderEntity o ORDER BY o.createdAt DESC")
    Page<OrderEntity> findRecentOrders(Pageable pageable);

    List<OrderEntity> findAllByUserOrderByCreatedAtDesc(UserEntity user);

    @Query("SELECT o FROM OrderEntity o WHERE o.user = :user ORDER BY o.createdAt DESC")
    Page<OrderEntity> findRecentOrdersByUser(@Param("user") UserEntity user, Pageable pageable);

    @Query("SELECT o.user.name as userName, SUM(o.grandTotal) as totalSales FROM OrderEntity o GROUP BY o.user.name")
    List<Object[]> findTotalSalesGroupedByUser();

    @Query("SELECT SUM(o.grandTotal) FROM OrderEntity o WHERE DATE(o.createdAt) = :date AND o.user.name = :userName")
    Double sumSalesByDateAndUserName(@Param("date") LocalDate date, @Param("userName") String userName);
}
