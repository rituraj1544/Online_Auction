package com.example.auction.service;

import com.example.auction.entity.Wishlist;
import java.util.List;

public interface WishlistService {
    Wishlist addToWishlist(Long auctionId);
    void removeFromWishlist(Long auctionId);
    List<Wishlist> getWishlist();
}
