package com.example.auction.serviceImpl;

import com.example.auction.dto.AuctionRequest;
import com.example.auction.dto.AuctionResponse;
import com.example.auction.entity.Auction;
import com.example.auction.entity.Category;
import com.example.auction.entity.User;
import com.example.auction.repository.AuctionRepository;
import com.example.auction.repository.CategoryRepository;
import com.example.auction.repository.UserRepository;
import com.example.auction.service.AuctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuctionServiceImpl implements AuctionService {
    private final AuctionRepository auctionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final com.example.auction.repository.BidRepository bidRepository;

    @Override
    public AuctionResponse createAuction(AuctionRequest request) {
        LocalDateTime now = LocalDateTime.now();

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }
        if (!request.getEndTime().isAfter(now)) {
            throw new RuntimeException("End time must be in the future");
        }
        if (request.getStartingPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Starting price must be greater than zero");
        }
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        User seller = getCurrentUser();
        Auction auction = Auction.builder()
                .seller(seller)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .startingPrice(request.getStartingPrice())
                .currentPrice(request.getStartingPrice())
                .minimumIncrement(request.getMinimumIncrement())
                .image(request.getImage())
                .condition(request.getCondition())
                .location(request.getLocation())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(request.getStartTime().isAfter(now) ? Auction.Status.PENDING : Auction.Status.ACTIVE)
                .build();
        return AuctionResponse.fromEntity(auctionRepository.save(auction));
    }

    @Override
    public List<AuctionResponse> getAllAuctions() {
        return auctionRepository.findAll().stream().map(auction -> {
            long bidCount = bidRepository.countByAuction(auction);
            return AuctionResponse.fromEntity(auction, bidCount);
        }).collect(Collectors.toList());
    }

    @Override
    public AuctionResponse getAuctionById(Long id) {
        Auction auction = auctionRepository.findById(id).orElseThrow(() -> new RuntimeException("Auction not found"));
        long bidCount = bidRepository.countByAuction(auction);
        return AuctionResponse.fromEntity(auction, bidCount);
    }

    @Override
    public AuctionResponse updateAuction(Long id, AuctionRequest request) {
        Auction auction = auctionRepository.findById(id).orElseThrow(() -> new RuntimeException("Auction not found"));
        LocalDateTime now = LocalDateTime.now();

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }
        if (!request.getEndTime().isAfter(now)) {
            throw new RuntimeException("End time must be in the future");
        }

        auction.setTitle(request.getTitle());
        auction.setDescription(request.getDescription());
        auction.setCategory(categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new RuntimeException("Category not found")));
        auction.setStartingPrice(request.getStartingPrice());
        auction.setCurrentPrice(request.getStartingPrice());
        auction.setMinimumIncrement(request.getMinimumIncrement());
        auction.setImage(request.getImage());
        auction.setCondition(request.getCondition());
        auction.setLocation(request.getLocation());
        auction.setStartTime(request.getStartTime());
        auction.setEndTime(request.getEndTime());
        auction.setStatus(request.getStartTime().isAfter(now) ? Auction.Status.PENDING : Auction.Status.ACTIVE);
        return AuctionResponse.fromEntity(auctionRepository.save(auction));
    }

    @Override
    public void deleteAuction(Long id) {
        auctionRepository.deleteById(id);
    }

    @Override
    public List<AuctionResponse> getMyAuctions() {
        User user = getCurrentUser();
        return auctionRepository.findAll().stream()
                .filter(a -> a.getSeller() != null && a.getSeller().getId().equals(user.getId()))
                .map(auction -> {
                    long bidCount = bidRepository.countByAuction(auction);
                    return AuctionResponse.fromEntity(auction, bidCount);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<AuctionResponse> getWonAuctions() {
        User user = getCurrentUser();
        return auctionRepository.findAll().stream()
                .filter(a -> a.getWinner() != null && a.getWinner().getId().equals(user.getId()))
                .map(auction -> {
                    long bidCount = bidRepository.countByAuction(auction);
                    return AuctionResponse.fromEntity(auction, bidCount);
                })
                .collect(Collectors.toList());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
