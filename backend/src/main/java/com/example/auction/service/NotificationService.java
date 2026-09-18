package com.example.auction.service;

import com.example.auction.entity.Notification;
import com.example.auction.entity.User;
import java.util.List;

public interface NotificationService {
    List<Notification> getCurrentUserNotifications();
    void markRead(Long notificationId);
    void markAllRead();
    Notification createNotification(User user, String title, String message);
}
