package in.bushansirgur.billingsoftware.service.impl;

import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import in.bushansirgur.billingsoftware.entity.OrderEntity;
import in.bushansirgur.billingsoftware.entity.OrderItemEntity;
import in.bushansirgur.billingsoftware.entity.UserEntity;
import in.bushansirgur.billingsoftware.io.*;
import in.bushansirgur.billingsoftware.repository.OrderEntityRepository;
import in.bushansirgur.billingsoftware.repository.UserRepository;
import in.bushansirgur.billingsoftware.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    
    private final OrderEntityRepository orderEntityRepository;
    private final UserRepository userRepository;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Override
    public OrderResponse createOrder(OrderRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        UserEntity currentUser = userRepository.findByEmail(currentUserName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        OrderEntity newOrder = convertToOrderEntity(request);
        newOrder.setUser(currentUser);

        PaymentDetails paymentDetails = new PaymentDetails();
        paymentDetails.setStatus(newOrder.getPaymentMethod() == PaymentMethod.CASH ?
                PaymentDetails.PaymentStatus.COMPLETED : PaymentDetails.PaymentStatus.PENDING);
        newOrder.setPaymentDetails(paymentDetails);
        
        List<OrderItemEntity> orderItems = request.getCartItems().stream()
                .map(this::convertToOrderItemEntity)
                .collect(Collectors.toList());
        newOrder.setItems(orderItems);
        
        newOrder.setOrderId("ORD"+System.currentTimeMillis());
        newOrder = orderEntityRepository.save(newOrder);
        return convertToResponse(newOrder);
    }

    private OrderItemEntity convertToOrderItemEntity(OrderRequest.OrderItemRequest orderItemRequest) {
        return OrderItemEntity.builder()
                .itemId(orderItemRequest.getItemId())
                .name(orderItemRequest.getName())
                .price(orderItemRequest.getPrice())
                .quantity(orderItemRequest.getQuantity())
                .build();
    }

    private OrderResponse convertToResponse(OrderEntity newOrder) {
        OrderResponse.OrderResponseBuilder responseBuilder = OrderResponse.builder()
                .orderId(newOrder.getOrderId())
                .customerName(newOrder.getCustomerName())
                .phoneNumber(newOrder.getPhoneNumber())
                .subtotal(newOrder.getSubtotal())
                .tax(newOrder.getTax())
                .grandTotal(newOrder.getGrandTotal())
                .paymentMethod(newOrder.getPaymentMethod())
                .items(newOrder.getItems().stream()
                        .map(this::convertToItemResponse)
                        .collect(Collectors.toList()))
                .paymentDetails(newOrder.getPaymentDetails())
                .createdAt(newOrder.getCreatedAt());
        
        if (newOrder.getUser() != null) {
            responseBuilder.userName(newOrder.getUser().getName()); // Assuming UserEntity has a getName() method
        }
        return responseBuilder.build();
                
    }

    private OrderResponse.OrderItemResponse convertToItemResponse(OrderItemEntity orderItemEntity) {
        return OrderResponse.OrderItemResponse.builder()
                .itemId(orderItemEntity.getItemId())
                .name(orderItemEntity.getName())
                .price(orderItemEntity.getPrice())
                .quantity(orderItemEntity.getQuantity())
                .build();

    }

    private OrderEntity convertToOrderEntity(OrderRequest request) {
        return OrderEntity.builder()
                .customerName(request.getCustomerName())
                .phoneNumber(request.getPhoneNumber())
                .subtotal(request.getSubtotal())
                .tax(request.getTax())
                .grandTotal(request.getGrandTotal())
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()))
                .build();
    }

    @Override
    public void deleteOrder(String orderId) {
        OrderEntity existingOrder = orderEntityRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        orderEntityRepository.delete(existingOrder);
    }

    @Override
    public List<OrderResponse> getLatestOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        UserEntity currentUser = userRepository.findByEmail(currentUserName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return orderEntityRepository.findAllByOrderByCreatedAtDesc()
                    .stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        } else {
            return orderEntityRepository.findAllByUserOrderByCreatedAtDesc(currentUser)
                    .stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        }
    }

    @Override
    public OrderResponse verifyPayment(PaymentVerificationRequest request) {
        OrderEntity existingOrder = orderEntityRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!verifyRazorpaySignature(request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature())) {
            
            PaymentDetails paymentDetails = existingOrder.getPaymentDetails();
            paymentDetails.setStatus(PaymentDetails.PaymentStatus.FAILED);
            existingOrder.setPaymentDetails(paymentDetails);
            orderEntityRepository.save(existingOrder);

            throw new RuntimeException("Payment verification failed");
        }

        PaymentDetails paymentDetails = existingOrder.getPaymentDetails();
        paymentDetails.setRazorpayOrderId(request.getRazorpayOrderId());
        paymentDetails.setRazorpayPaymentId(request.getRazorpayPaymentId());
        paymentDetails.setRazorpaySignature(request.getRazorpaySignature());
        paymentDetails.setStatus(PaymentDetails.PaymentStatus.COMPLETED);

        existingOrder = orderEntityRepository.save(existingOrder);
        return convertToResponse(existingOrder);

    }

    @Override
    public Double sumSalesByDate(LocalDate date) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        UserEntity currentUser = userRepository.findByEmail(currentUserName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            Double totalSales = orderEntityRepository.sumSalesByDate(date);
            return totalSales != null ? totalSales : 0.0;
        } else {
            Double userSales = orderEntityRepository.sumSalesByDateAndUser(date, currentUser);
            return userSales != null ? userSales : 0.0;
        }
    }

    @Override
    public Long countByOrderDate(LocalDate date) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        UserEntity currentUser = userRepository.findByEmail(currentUserName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            Long totalCount = orderEntityRepository.countByOrderDate(date);
            return totalCount != null ? totalCount : 0L;
        } else {
            Long userCount = orderEntityRepository.countByOrderDateAndUser(date, currentUser);
            return userCount != null ? userCount : 0L;
        }
    }

    @Override
    public List<OrderResponse> findRecentOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        UserEntity currentUser = userRepository.findByEmail(currentUserName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return orderEntityRepository.findRecentOrders(PageRequest.of(0, 5))
                    .stream()
                    .map(orderEntity -> convertToResponse(orderEntity))
                    .collect(Collectors.toList());
        } else {
            return orderEntityRepository.findRecentOrdersByUser(currentUser, PageRequest.of(0, 5))
                    .stream()
                    .map(orderEntity -> convertToResponse(orderEntity))
                    .collect(Collectors.toList());
        }
    }

    private boolean verifyRazorpaySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            Utils.verifyPaymentSignature(options, razorpayKeySecret);
            return true;
        } catch (RazorpayException e) {
            System.err.println("Razorpay signature verification failed: " + e.getMessage());
            return false;
        }
    }

    @Override
    public List<SalesByUserResponse> getTotalSalesGroupedByUser() {
        List<Object[]> results = orderEntityRepository.findTotalSalesGroupedByUser();
        return results.stream()
                .map(obj -> new SalesByUserResponse((String) obj[0], (Double) obj[1]))
                .collect(Collectors.toList());
    }
}
