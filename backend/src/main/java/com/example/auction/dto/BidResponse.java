package com.example.auction.dto;

import com.example.auction.entity.Bid;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class BidResponse {
    private Long id;
    private Long auctionId;
    private String auctionTitle;
    private String auctionImage;
    private String auctionStatus;
    private LocalDateTime auctionEndTime;
    private Long bidderId;
    private String bidderName;
    private BigDecimal amount;
    private LocalDateTime bidTime;

    public static BidResponse fromEntity(Bid bid) {
        return BidResponse.builder()
                .id(bid.getId())
                .auctionId(bid.getAuction().getId())
                .auctionTitle(bid.getAuction().getTitle())
                .auctionImage(bid.getAuction().getImage())
                .auctionStatus(bid.getAuction().getStatus().name())
                .auctionEndTime(bid.getAuction().getEndTime())
                .bidderId(bid.getBidder().getId())
                .bidderName(bid.getBidder().getFullName())
                .amount(bid.getAmount())
                .bidTime(bid.getBidTime())
                .build();
    }
}
