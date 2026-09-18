package com.example.auction.service;

import com.example.auction.dto.UserDto;

public interface UserService {
    UserDto getCurrentUserProfile();
    UserDto updateProfile(UserDto request);
}
