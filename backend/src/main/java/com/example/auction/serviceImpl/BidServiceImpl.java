package com.example.auction.serviceImpl;

import com.example.auction.dto.BidRequest;
import com.example.auction.dto.BidResponse;
import com.example.auction.entity.Auction;
import com.example.auction.entity.Bid;
import com.example.auction.entity.User;
import com.example.auction.repository.AuctionRepository;
import com.example.auction.repository.BidRepository;
import com.example.auction.repository.UserRepository;
import com.example.auction.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {
    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final com.example.auction.service.NotificationService notificationService;

    @Override
    @Transactional
    public BidResponse placeBid(BidRequest request) {
        Auction auction = auctionRepository.findByIdForUpdate(request.getAuctionId())
                .orElseThrow(() -> new RuntimeException("Auction not found"));
        User bidder = getCurrentUser();
        LocalDateTime now = LocalDateTime.now();

        // Check bidder account is active
        if (bidder.getStatus() == User.Status.SUSPENDED) {
            throw new RuntimeException("Your account is suspended. You cannot place bids.");
        }

        if (auction.getSeller().getId().equals(bidder.getId())) {
            throw new RuntimeException("Seller cannot bid on own auction");
        }
        if (auction.getStartTime() != null && auction.getStartTime().isAfter(now)) {
            throw new RuntimeException("Auction has not started");
        }
        if (auction.getEndTime() != null && !auction.getEndTime().isAfter(now)) {
            auction.setStatus(Auction.Status.ENDED);
            auctionRepository.save(auction);
            throw new RuntimeException("Auction has ended");
        }
        if (auction.getStatus() != Auction.Status.ACTIVE) {
            throw new RuntimeException("Auction is not active");
        }
        if (request.getAmount().compareTo(auction.getCurrentPrice()) <= 0) {
            throw new RuntimeException("Bid must be greater than current price");
        }
        if (request.getAmount().subtract(auction.getCurrentPrice()).compareTo(auction.getMinimumIncrement()) < 0) {
            throw new RuntimeException("Bid must respect minimum increment");
        }

        // Get current highest bidder before placing new bid
        List<Bid> bids = bidRepository.findByAuctionOrderByBidTimeAsc(auction);
        User previousHighestBidder = bids.isEmpty() ? null : bids.get(bids.size() - 1).getBidder();

        Bid bid = Bid.builder()
                .auction(auction)
                .bidder(bidder)
                .amount(request.getAmount())
                .build();
        auction.setCurrentPrice(request.getAmount());
        auctionRepository.save(auction);
        Bid savedBid = bidRepository.save(bid);

        // Notify previous highest bidder if they were outbid
        if (previousHighestBidder != null && !previousHighestBidder.getId().equals(bidder.getId())) {
            notificationService.createNotification(
                    previousHighestBidder,
                    "Outbid on " + auction.getTitle(),
                    "Someone has placed a higher bid of $" + request.getAmount() + " on " + auction.getTitle()
            );
        }

        BidResponse response = BidResponse.fromEntity(savedBid);
        messagingTemplate.convertAndSend("/topic/bids", response);
        return response;
    }

    @Override
    public List<BidResponse> getBidsForAuction(Long auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));
        return bidRepository.findByAuctionOrderByBidTimeAsc(auction).stream()
                .map(BidResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<BidResponse> getMyBids() {
        User bidder = getCurrentUser();
        return bidRepository.findByBidder(bidder).stream()
                .map(BidResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
