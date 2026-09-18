package com.example.auction.controller;

import com.example.auction.entity.Wishlist;
import com.example.auction.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;

    @PostMapping("/{auctionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Wishlist> add(@PathVariable Long auctionId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(auctionId));
    }

    @DeleteMapping("/{auctionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> remove(@PathVariable Long auctionId) {
        wishlistService.removeFromWishlist(auctionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Wishlist>> getWishlist() {
        return ResponseEntity.ok(wishlistService.getWishlist());
    }
}
