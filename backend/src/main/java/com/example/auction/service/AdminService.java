package com.example.auction.service;

import com.example.auction.dto.UserDto;
import java.util.List;
import java.util.Map;

public interface AdminService {
    Map<String, Object> getDashboard();
    List<UserDto> getUsers();
    UserDto updateUserStatus(Long userId, String status);
    UserDto updateUserRole(Long userId, String role);
    void deleteAuction(Long auctionId);
}
