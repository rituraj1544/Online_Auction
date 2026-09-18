package com.example.auction.service;

import com.example.auction.dto.AuctionRequest;
import com.example.auction.dto.AuctionResponse;
import java.util.List;

public interface AuctionService {
    AuctionResponse createAuction(AuctionRequest request);
    List<AuctionResponse> getAllAuctions();
    AuctionResponse getAuctionById(Long id);
    AuctionResponse updateAuction(Long id, AuctionRequest request);
    void deleteAuction(Long id);
    List<AuctionResponse> getMyAuctions();
    List<AuctionResponse> getWonAuctions();
}
