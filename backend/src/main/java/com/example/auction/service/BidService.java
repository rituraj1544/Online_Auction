package com.example.auction.service;

import com.example.auction.dto.BidRequest;
import com.example.auction.dto.BidResponse;
import java.util.List;

public interface BidService {
    BidResponse placeBid(BidRequest request);
    List<BidResponse> getBidsForAuction(Long auctionId);
    List<BidResponse> getMyBids();
}

