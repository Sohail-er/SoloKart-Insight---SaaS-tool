package in.bushansirgur.billingsoftware.repository;

import in.bushansirgur.billingsoftware.entity.OrderEntity;
import in.bushansirgur.billingsoftware.entity.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OrderEntityRepository extends JpaRepository<OrderEntity, Long> {

    Optional<OrderEntity> findByOrderId(String orderId);

    List<OrderEntity> findAllByOrderByCreatedAtDesc();

    @Query("SELECT SUM(o.grandTotal) FROM OrderEntity o WHERE DATE(o.createdAt) = :date")
    Double sumSalesByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(o.grandTotal), 0.0) FROM OrderEntity o WHERE DATE(o.createdAt) = :date AND o.user = :user")
    Double sumSalesByDateAndUser(@Param("date") LocalDate date, @Param("user") UserEntity user);

    @Query("SELECT COUNT(o) FROM OrderEntity o WHERE DATE(o.createdAt) = :date")
    Long countByOrderDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(o) FROM OrderEntity o WHERE DATE(o.createdAt) = :date AND o.user = :user")
    Long countByOrderDateAndUser(@Param("date") LocalDate date, @Param("user") UserEntity user);

    @Query("SELECT o FROM OrderEntity o ORDER BY o.createdAt DESC")
    List<OrderEntity> findRecentOrders(Pageable pageable);

    List<OrderEntity> findAllByUserOrderByCreatedAtDesc(UserEntity user);

    @Query("SELECT o FROM OrderEntity o WHERE o.user = :user ORDER BY o.createdAt DESC")
    List<OrderEntity> findRecentOrdersByUser(@Param("user") UserEntity user, Pageable pageable);

    @Query("SELECT o.user.name, SUM(o.grandTotal) FROM OrderEntity o GROUP BY o.user.name")
    List<Object[]> findTotalSalesGroupedByUser();

}
