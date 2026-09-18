package com.example.auction.util;

import com.example.auction.entity.Category;
import com.example.auction.entity.User;
import com.example.auction.repository.CategoryRepository;
import com.example.auction.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .fullName("Administrator")
                    .email("admin@auction.local")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(User.Role.ADMIN)
                    .status(User.Status.ACTIVE)
                    .build();
            userRepository.save(admin);
        }

        List<String> defaultCategories = List.of("Electronics", "Vehicles", "Furniture", "Fashion", "Books", "Sports", "Home Appliances", "Collectibles", "Others");
        for (String name : defaultCategories) {
            if (categoryRepository.findByName(name).isEmpty()) {
                categoryRepository.save(Category.builder().name(name).build());
            }
        }
    }
}
