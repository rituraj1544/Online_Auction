package com.example.auction.repository;

import com.example.auction.entity.Auction;
import com.example.auction.entity.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AuctionRepository extends JpaRepository<Auction, Long> {
    List<Auction> findByStatus(Auction.Status status);
    List<Auction> findBySeller(User seller);
    List<Auction> findByEndTimeBeforeAndStatusNot(LocalDateTime now, Auction.Status status);
    List<Auction> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Auction a where a.id = :id")
    Optional<Auction> findByIdForUpdate(@Param("id") Long id);
}
