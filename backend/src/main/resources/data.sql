-- Categories
INSERT IGNORE INTO categories (id, name) VALUES
  (1, 'Electronics'),
  (2, 'Clothing'),
  (3, 'Collectibles'),
  (4, 'Art'),
  (5, 'Jewelry'),
  (6, 'Furniture'),
  (7, 'Sports'),
  (8, 'Automobiles');

-- Users
INSERT IGNORE INTO users (id, full_name, email, password, role, status, created_at) VALUES
  (1, 'Admin User', 'admin@example.com', '$2a$10$XJ8J.s3J4.sR2T8WqG2T.eQ7d/lH8K9f6E9y1yO.XJ8J.s3J4.sR2', 'ADMIN', 'ACTIVE', NOW()),
  (2, 'Sophia Bennett', 'sophia@example.com', '$2a$10$XJ8J.s3J4.sR2T8WqG2T.eQ7d/lH8K9f6E9y1yO.XJ8J.s3J4.sR2', 'USER', 'ACTIVE', NOW()),
  (3, 'Liam Carter', 'liam@example.com', '$2a$10$XJ8J.s3J4.sR2T8WqG2T.eQ7d/lH8K9f6E9y1yO.XJ8J.s3J4.sR2', 'USER', 'ACTIVE', NOW()),
  (4, 'Ritu Raj', 'ritu@example.com', '$2a$10$XJ8J.s3J4.sR2T8WqG2T.eQ7d/lH8K9f6E9y1yO.XJ8J.s3J4.sR2', 'USER', 'ACTIVE', NOW()),
  (5, 'Emma Watson', 'emma@example.com', '$2a$10$XJ8J.s3J4.sR2T8WqG2T.eQ7d/lH8K9f6E9y1yO.XJ8J.s3J4.sR2', 'USER', 'ACTIVE', NOW()),
  (6, 'Oliver Twist', 'oliver@example.com', '$2a$10$XJ8J.s3J4.sR2T8WqG2T.eQ7d/lH8K9f6E9y1yO.XJ8J.s3J4.sR2', 'USER', 'ACTIVE', NOW()),
  (7, 'Noah James', 'noah@example.com', '$2a$10$XJ8J.s3J4.sR2T8WqG2T.eQ7d/lH8K9f6E9y1yO.XJ8J.s3J4.sR2', 'USER', 'ACTIVE', NOW());

-- Auctions
INSERT IGNORE INTO auctions (id, seller_id, title, description, category_id, starting_price, current_price, minimum_increment, image, item_condition, location, start_time, end_time, status, created_at) VALUES
  (1, 1, 'Vintage Golf Ball', 'A rare collectible Titleist golf ball from the 1990s in pristine condition.', 3, 100.00, 188.01, 1.00, 'https://images.unsplash.com/photo-1592911130327-0b1686de6526?auto=format&fit=crop&q=80&w=400', 'Excellent', 'New York, USA', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 6 DAY), 'ACTIVE', NOW()),
  (2, 2, 'Professional Cricket Wicket', 'Handcrafted professional-grade cricket stumps made from premium ash wood.', 7, 150.00, 219.00, 5.00, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=400', 'New', 'London, UK', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY), 'ACTIVE', NOW()),
  (3, 3, 'Red Leather Cricket Ball', 'Match-ready, hand-stitched leather cricket ball. Used in local leagues.', 7, 50.00, 89.00, 2.00, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=400', 'Good', 'Sydney, AUS', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY), 'ACTIVE', NOW()),
  

  -- ENDED (COMPLETED)
  (6, 6, 'Antique Wooden Chair', 'A 19th century chair, auction completed.', 6, 80.00, 250.00, 5.00, 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400', 'Good', 'Rome, IT', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 'ENDED', NOW()),
  (7, 7, 'Used Sports Car', '2015 sports car, sold recently.', 8, 15000.00, 22500.00, 500.00, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=400', 'Good', 'Berlin, DE', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 'ENDED', NOW()),

  -- 5 MORE ACTIVE ITEMS WITH PHOTOS
  (8, 2, 'Mechanical Keyboard', 'Custom built mechanical keyboard with linear switches.', 1, 100.00, 150.00, 2.00, 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400', 'Like New', 'Tokyo, JP', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 4 DAY), 'ACTIVE', NOW()),
  (9, 3, 'Oil Painting Landscape', 'Original oil painting of a mountain landscape.', 4, 300.00, 300.00, 20.00, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400', 'Excellent', 'Amsterdam, NL', DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_ADD(NOW(), INTERVAL 7 DAY), 'ACTIVE', NOW()),
  (10, 4, 'Designer Leather Jacket', 'Limited edition leather jacket in size M.', 2, 250.00, 280.00, 10.00, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400', 'Good', 'Milan, IT', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY), 'ACTIVE', NOW()),
  (11, 5, 'Rare Gold Coin', '1800s gold coin, highly sought after by collectors.', 3, 1000.00, 1250.00, 50.00, 'https://images.unsplash.com/photo-1616212175985-78e0f6c26bd5?auto=format&fit=crop&q=80&w=400', 'Excellent', 'London, UK', DATE_SUB(NOW(), INTERVAL 12 HOUR), DATE_ADD(NOW(), INTERVAL 3 DAY), 'ACTIVE', NOW()),
  (12, 6, 'Smart Watch Pro', 'Latest smart watch with health tracking features.', 1, 180.00, 180.00, 5.00, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=400', 'New', 'San Francisco, USA', DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_ADD(NOW(), INTERVAL 5 DAY), 'ACTIVE', NOW());

-- Bids
INSERT IGNORE INTO bids (id, auction_id, bidder_id, amount, bid_time) VALUES
  -- Bids for Golf Ball (Auction 1)
  (1, 1, 2, 105.00, DATE_SUB(NOW(), INTERVAL 20 HOUR)),
  (2, 1, 3, 115.00, DATE_SUB(NOW(), INTERVAL 18 HOUR)),
  (3, 1, 4, 125.00, DATE_SUB(NOW(), INTERVAL 15 HOUR)),
  (4, 1, 2, 140.00, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
  (5, 1, 3, 155.00, DATE_SUB(NOW(), INTERVAL 10 HOUR)),
  (6, 1, 4, 170.00, DATE_SUB(NOW(), INTERVAL 8 HOUR)),
  (7, 1, 2, 180.00, DATE_SUB(NOW(), INTERVAL 5 HOUR)),
  (8, 1, 3, 185.00, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  (9, 1, 4, 188.01, DATE_SUB(NOW(), INTERVAL 1 HOUR)),

  -- Bids for Cricket Wicket (Auction 2)
  (10, 2, 1, 160.00, DATE_SUB(NOW(), INTERVAL 24 HOUR)),
  (11, 2, 3, 175.00, DATE_SUB(NOW(), INTERVAL 20 HOUR)),
  (12, 2, 4, 190.00, DATE_SUB(NOW(), INTERVAL 15 HOUR)),
  (13, 2, 1, 200.00, DATE_SUB(NOW(), INTERVAL 10 HOUR)),
  (14, 2, 4, 219.00, DATE_SUB(NOW(), INTERVAL 3 HOUR)),

  -- Bids for Cricket Ball (Auction 3)
  (15, 3, 2, 55.00, DATE_SUB(NOW(), INTERVAL 48 HOUR)),
  (16, 3, 4, 65.00, DATE_SUB(NOW(), INTERVAL 36 HOUR)),
  (17, 3, 2, 75.00, DATE_SUB(NOW(), INTERVAL 24 HOUR)),
  (18, 3, 1, 89.00, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
  
  -- Bids for Antique Wooden Chair (Auction 6 - ENDED)
  (19, 6, 2, 150.00, DATE_SUB(NOW(), INTERVAL 5 DAY)),
  (20, 6, 3, 250.00, DATE_SUB(NOW(), INTERVAL 2 DAY)),
  
  -- Bids for Used Sports Car (Auction 7 - ENDED)
  (21, 7, 5, 20000.00, DATE_SUB(NOW(), INTERVAL 8 DAY)),
  (22, 7, 6, 22500.00, DATE_SUB(NOW(), INTERVAL 3 DAY)),
  
  -- Bids for Mechanical Keyboard (Auction 8 - ACTIVE)
  (23, 8, 3, 120.00, DATE_SUB(NOW(), INTERVAL 10 HOUR)),
  (24, 8, 4, 150.00, DATE_SUB(NOW(), INTERVAL 5 HOUR)),
  
  -- Bids for Designer Leather Jacket (Auction 10 - ACTIVE)
  (25, 10, 7, 280.00, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
  
  -- Bids for Rare Gold Coin (Auction 11 - ACTIVE)
  (26, 11, 2, 1100.00, DATE_SUB(NOW(), INTERVAL 6 HOUR)),
  (27, 11, 4, 1250.00, DATE_SUB(NOW(), INTERVAL 1 HOUR));
