package com.example.auction.repository;

import com.example.auction.entity.Auction;
import com.example.auction.entity.Bid;
import com.example.auction.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByAuctionOrderByBidTimeAsc(Auction auction);
    List<Bid> findByBidder(User bidder);
    long countByAuction(Auction auction);
}
