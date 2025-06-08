package com.solokart.service;

import com.razorpay.RazorpayException;
import com.solokart.io.RazorpayOrderResponse;

public interface RazorpayService {

    RazorpayOrderResponse createOrder(Double amount, String currency) throws RazorpayException;
}
