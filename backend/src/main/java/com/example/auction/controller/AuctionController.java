package com.example.auction.controller;

import com.example.auction.dto.AuctionRequest;
import com.example.auction.dto.AuctionResponse;
import com.example.auction.service.AuctionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
public class AuctionController {
    private final AuctionService auctionService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuctionResponse> createAuction(@Valid @RequestBody AuctionRequest request) {
        return ResponseEntity.ok(auctionService.createAuction(request));
    }

    @GetMapping
    public ResponseEntity<List<AuctionResponse>> getAuctions() {
        return ResponseEntity.ok(auctionService.getAllAuctions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionResponse> getAuction(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.getAuctionById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuctionResponse> updateAuction(@PathVariable Long id, @Valid @RequestBody AuctionRequest request) {
        return ResponseEntity.ok(auctionService.updateAuction(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteAuction(@PathVariable Long id) {
        auctionService.deleteAuction(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AuctionResponse>> getMyAuctions() {
        return ResponseEntity.ok(auctionService.getMyAuctions());
    }

    @GetMapping("/won")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AuctionResponse>> getWonAuctions() {
        return ResponseEntity.ok(auctionService.getWonAuctions());
    }
}
