package com.example.auction.serviceImpl;

import com.example.auction.dto.UserDto;
import com.example.auction.entity.User;
import com.example.auction.repository.UserRepository;
import com.example.auction.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public UserDto getCurrentUserProfile() {
        User user = getCurrentUser();
        return UserDto.fromEntity(user);
    }

    @Override
    public UserDto updateProfile(UserDto request) {
        User user = getCurrentUser();
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setProfileImage(request.getProfileImage());
        return UserDto.fromEntity(userRepository.save(user));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
