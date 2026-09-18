package com.example.auction.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AuctionRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private Long categoryId;

    @DecimalMin(value = "0.01")
    private BigDecimal startingPrice;

    @DecimalMin(value = "0.01")
    private BigDecimal minimumIncrement;

    private String image;
    private String condition;
    private String location;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;
}
