package com.example.auction.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class BidRequest {
    @NotNull
    private Long auctionId;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;
}
