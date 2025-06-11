package com.solokart.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesByUserResponse {
    private String userName;
    private Double totalSales;
    private Double todaySales;
} 