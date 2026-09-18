package com.example.auction.scheduler;

import com.example.auction.entity.Auction;
import com.example.auction.entity.Bid;
import com.example.auction.repository.AuctionRepository;
import com.example.auction.repository.BidRepository;
import com.example.auction.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AuctionScheduler {
    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final NotificationService notificationService;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate = 30000)
    public void updateAuctionStatuses() {
        LocalDateTime now = LocalDateTime.now();

        // Activate pending auctions whose start time has passed
        List<Auction> auctionsToStart = auctionRepository.findByStatus(Auction.Status.PENDING);
        for (Auction auction : auctionsToStart) {
            if (auction.getStartTime() != null
                    && !auction.getStartTime().isAfter(now)
                    && (auction.getEndTime() == null || auction.getEndTime().isAfter(now))) {
                auction.setStatus(Auction.Status.ACTIVE);
                Auction savedAuction = auctionRepository.save(auction);
                long bidCount = bidRepository.countByAuction(savedAuction);
                messagingTemplate.convertAndSend("/topic/auctions", com.example.auction.dto.AuctionResponse.fromEntity(savedAuction, bidCount));
            }
        }

        // End auctions and notify winner + seller
        List<Auction> auctionsToEnd = auctionRepository.findByEndTimeBeforeAndStatusNot(now, Auction.Status.ENDED);
        for (Auction auction : auctionsToEnd) {
            auction.setStatus(Auction.Status.ENDED);

            // Find the highest bid to determine winner
            List<Bid> bids = bidRepository.findByAuctionOrderByBidTimeAsc(auction);
            Optional<Bid> highestBid = bids.stream()
                    .max(Comparator.comparing(Bid::getAmount));

            if (highestBid.isPresent()) {
                Bid winningBid = highestBid.get();
                auction.setWinner(winningBid.getBidder());
                auctionRepository.save(auction);

                // Notify winner
                notificationService.createNotification(
                        winningBid.getBidder(),
                        "🏆 You won the auction!",
                        "Congratulations! You won \"" + auction.getTitle() + "\" with a bid of $" + winningBid.getAmount() + "."
                );

                // Notify seller
                if (auction.getSeller() != null) {
                    notificationService.createNotification(
                            auction.getSeller(),
                            "🎉 Your auction ended",
                            "Your auction \"" + auction.getTitle() + "\" ended. Winning bid: $" + winningBid.getAmount() + " by " + winningBid.getBidder().getFullName() + "."
                    );
                }
            } else {
                // No bids — just end the auction and notify seller
                auctionRepository.save(auction);
                if (auction.getSeller() != null) {
                    notificationService.createNotification(
                            auction.getSeller(),
                            "📦 Auction ended with no bids",
                            "Your auction \"" + auction.getTitle() + "\" ended without any bids."
                    );
                }
            }

            long bidCount = bidRepository.countByAuction(auction);
            messagingTemplate.convertAndSend("/topic/auctions", com.example.auction.dto.AuctionResponse.fromEntity(auction, bidCount));
        }
    }
}
