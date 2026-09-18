package com.example.auction.controller;

import com.example.auction.dto.UserDto;
import com.example.auction.entity.Auction;
import com.example.auction.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> dashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> users() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @PutMapping("/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(adminService.updateUserStatus(id, status));
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateRole(@PathVariable Long id, @RequestParam String role) {
        return ResponseEntity.ok(adminService.updateUserRole(id, role));
    }

    @DeleteMapping("/auction/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAuction(@PathVariable Long id) {
        adminService.deleteAuction(id);
        return ResponseEntity.noContent().build();
    }
}
