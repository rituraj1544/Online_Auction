package com.example.auction.config;

import com.example.auction.entity.Auction;
import com.example.auction.entity.Bid;
import com.example.auction.entity.User;
import com.example.auction.repository.AuctionRepository;
import com.example.auction.repository.BidRepository;
import com.example.auction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class SeedRunner implements CommandLineRunner {

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        seedBidsForAuction(8L, new Long[]{3L, 4L, 5L}, new String[]{"110.00", "130.00", "145.00"});
        seedBidsForAuction(9L, new Long[]{2L, 6L, 7L, 4L}, new String[]{"310.00", "330.00", "350.00", "375.00"});
        seedBidsForAuction(10L, new Long[]{5L, 3L, 6L}, new String[]{"260.00", "275.00", "280.00"});
        seedBidsForAuction(11L, new Long[]{2L, 4L, 7L, 3L, 5L}, new String[]{"1050.00", "1100.00", "1150.00", "1200.00", "1250.00"});
        seedBidsForAuction(12L, new Long[]{2L, 4L}, new String[]{"185.00", "195.00"});
    }

    private void seedBidsForAuction(Long auctionId, Long[] userIds, String[] amounts) {
        auctionRepository.findById(auctionId).ifPresent(auction -> {
            if (bidRepository.countByAuction(auction) == 0) {
                for (int i = 0; i < userIds.length; i++) {
                    User bidder = userRepository.findById(userIds[i]).orElse(null);
                    if (bidder != null) {
                        BigDecimal amount = new BigDecimal(amounts[i]);
                        Bid bid = Bid.builder()
                                .auction(auction)
                                .bidder(bidder)
                                .amount(amount)
                                .bidTime(LocalDateTime.now().minusHours(userIds.length - i))
                                .build();
                        bidRepository.save(bid);
                        auction.setCurrentPrice(amount);
                    }
                }
                auctionRepository.save(auction);
                System.out.println("Seeded bids for auction " + auctionId);
            }
        });
    }
}
