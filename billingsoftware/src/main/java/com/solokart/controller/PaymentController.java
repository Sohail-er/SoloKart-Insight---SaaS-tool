package com.solokart.controller;

import com.razorpay.RazorpayException;
import com.solokart.io.OrderResponse;
import com.solokart.io.PaymentRequest;
import com.solokart.io.PaymentVerificationRequest;
import com.solokart.io.RazorpayOrderResponse;
import com.solokart.service.OrderService;
import com.solokart.service.RazorpayService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayService razorpayService;
    private final OrderService orderService;

    @PostMapping("/create-order")
    @ResponseStatus(HttpStatus.CREATED)
    public RazorpayOrderResponse createRazorpayOrder(@RequestBody PaymentRequest request) throws RazorpayException {
        return razorpayService.createOrder(request.getAmount(), request.getCurrency());
    }

    @PostMapping("/verify")
    public OrderResponse verifyPayment(@RequestBody PaymentVerificationRequest request) {
        return orderService.verifyPayment(request);
    }
}
