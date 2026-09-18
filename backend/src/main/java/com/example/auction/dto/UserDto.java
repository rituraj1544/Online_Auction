package com.example.auction.dto;

import com.example.auction.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String profileImage;
    private String role;
    private String status;

    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .profileImage(user.getProfileImage())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .build();
    }
}
