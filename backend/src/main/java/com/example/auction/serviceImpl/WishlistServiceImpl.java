package com.example.auction.serviceImpl;

import com.example.auction.entity.Auction;
import com.example.auction.entity.User;
import com.example.auction.entity.Wishlist;
import com.example.auction.repository.AuctionRepository;
import com.example.auction.repository.UserRepository;
import com.example.auction.repository.WishlistRepository;
import com.example.auction.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {
    private final WishlistRepository wishlistRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

    @Override
    public Wishlist addToWishlist(Long auctionId) {
        User user = getCurrentUser();
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new RuntimeException("Auction not found"));
        if (wishlistRepository.findByUserAndAuction(user, auction).isPresent()) {
            throw new RuntimeException("Already in wishlist");
        }
        return wishlistRepository.save(Wishlist.builder().user(user).auction(auction).build());
    }

    @Override
    public void removeFromWishlist(Long auctionId) {
        User user = getCurrentUser();
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new RuntimeException("Auction not found"));
        Wishlist wishlist = wishlistRepository.findByUserAndAuction(user, auction)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));
        wishlistRepository.delete(wishlist);
    }

    @Override
    public List<Wishlist> getWishlist() {
        return wishlistRepository.findByUser(getCurrentUser());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
