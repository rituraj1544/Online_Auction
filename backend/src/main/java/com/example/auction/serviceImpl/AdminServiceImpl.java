package com.example.auction.serviceImpl;

import com.example.auction.dto.UserDto;
import com.example.auction.entity.Auction;
import com.example.auction.entity.User;
import com.example.auction.repository.AuctionRepository;
import com.example.auction.repository.UserRepository;
import com.example.auction.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;

    @Override
    public Map<String, Object> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalUsers", userRepository.count());
        dashboard.put("totalAuctions", auctionRepository.count());
        dashboard.put("activeAuctions", auctionRepository.findByStatus(Auction.Status.ACTIVE).size());
        dashboard.put("completedAuctions", auctionRepository.findByStatus(Auction.Status.ENDED).size());
        return dashboard;
    }

    @Override
    public List<UserDto> getUsers() {
        return userRepository.findAll().stream().map(UserDto::fromEntity).collect(Collectors.toList());
    }

    @Override
    public UserDto updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.Status.valueOf(status.toUpperCase()));
        return UserDto.fromEntity(userRepository.save(user));
    }

    @Override
    public UserDto updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(User.Role.valueOf(role.toUpperCase()));
        return UserDto.fromEntity(userRepository.save(user));
    }

    @Override
    public void deleteAuction(Long auctionId) {
        auctionRepository.deleteById(auctionId);
    }
}
