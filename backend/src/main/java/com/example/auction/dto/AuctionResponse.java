package com.example.auction.dto;

import com.example.auction.entity.Auction;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AuctionResponse {
    private Long id;
    private String title;
    private String description;
    private Long categoryId;
    private String categoryName;
    private BigDecimal startingPrice;
    private BigDecimal currentPrice;
    private BigDecimal minimumIncrement;
    private String image;
    private String condition;
    private String location;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private Long sellerId;
    private String sellerName;
    private Long winnerId;
    private String winnerName;
    private Long bidCount;
    private LocalDateTime createdAt;

    public static AuctionResponse fromEntity(Auction auction) {
        return AuctionResponse.builder()
                .id(auction.getId())
                .title(auction.getTitle())
                .description(auction.getDescription())
                .categoryId(auction.getCategory() != null ? auction.getCategory().getId() : null)
                .categoryName(auction.getCategory() != null ? auction.getCategory().getName() : null)
                .startingPrice(auction.getStartingPrice())
                .currentPrice(auction.getCurrentPrice())
                .minimumIncrement(auction.getMinimumIncrement())
                .image(auction.getImage())
                .condition(auction.getCondition())
                .location(auction.getLocation())
                .startTime(auction.getStartTime())
                .endTime(auction.getEndTime())
                .status(auction.getStatus().name())
                .sellerId(auction.getSeller() != null ? auction.getSeller().getId() : null)
                .sellerName(auction.getSeller() != null ? auction.getSeller().getFullName() : null)
                .winnerId(auction.getWinner() != null ? auction.getWinner().getId() : null)
                .winnerName(auction.getWinner() != null ? auction.getWinner().getFullName() : null)
                .createdAt(auction.getCreatedAt())
                .build();
    }

    public static AuctionResponse fromEntity(Auction auction, long bidCount) {
        AuctionResponse resp = fromEntity(auction);
        resp.setBidCount(bidCount);
        return resp;
    }
}
