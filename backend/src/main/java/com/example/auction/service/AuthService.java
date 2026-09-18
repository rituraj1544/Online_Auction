package com.example.auction.service;

import com.example.auction.dto.AuthRequest;
import com.example.auction.dto.AuthResponse;
import com.example.auction.dto.LoginRequest;

public interface AuthService {
    AuthResponse register(AuthRequest request);
    AuthResponse login(LoginRequest request);
}
