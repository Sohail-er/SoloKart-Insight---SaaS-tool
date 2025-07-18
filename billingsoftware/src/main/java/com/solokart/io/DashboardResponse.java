package com.solokart.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {

    private Double todaySales;
    private Long todayOrderCount;
    private List<OrderResponse> recentOrders;
    private List<SalesByUserResponse> salesByUser;
}
