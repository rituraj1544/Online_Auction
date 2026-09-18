package com.example.auction;

import com.example.auction.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtUtilTest {
    @Test
    void generateAndValidateToken() {
        JwtUtil jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "auction-platform-super-secret-key-change-me");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L);
        ReflectionTestUtils.setField(jwtUtil, "refreshExpiration", 604800000L);

        String token = jwtUtil.generateToken("user@example.com");

        assertTrue(jwtUtil.validateToken(token));
        assertEquals("user@example.com", jwtUtil.extractUsername(token));
    }
}
