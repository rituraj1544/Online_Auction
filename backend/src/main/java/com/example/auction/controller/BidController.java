package com.example.auction.controller;

import com.example.auction.dto.BidRequest;
import com.example.auction.dto.BidResponse;
import com.example.auction.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
public class BidController {
    private final BidService bidService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BidResponse> placeBid(@Valid @RequestBody BidRequest request) {
        return ResponseEntity.ok(bidService.placeBid(request));
    }

    @GetMapping("/{auctionId}")
    public ResponseEntity<List<BidResponse>> getBids(@PathVariable Long auctionId) {
        return ResponseEntity.ok(bidService.getBidsForAuction(auctionId));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BidResponse>> getMyBids() {
        return ResponseEntity.ok(bidService.getMyBids());
    }
}
