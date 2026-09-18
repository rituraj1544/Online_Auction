package com.example.auction.repository;

import com.example.auction.entity.Auction;
import com.example.auction.entity.User;
import com.example.auction.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUserAndAuction(User user, Auction auction);
    List<Wishlist> findByUser(User user);
}
