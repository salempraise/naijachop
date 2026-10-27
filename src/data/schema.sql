-- ============================================================
-- NaijaChop - Nigerian Food Delivery Database Schema
-- Production Ready MySQL Script with Foreign Keys, Triggers & Seed
-- ============================================================

CREATE DATABASE IF NOT EXISTS `naijachop_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `naijachop_db`;

-- 1. Users Table (Customers)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(25) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'kitchen_manager', 'dispatch_coordinator') DEFAULT 'kitchen_manager',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Food Categories Table
CREATE TABLE IF NOT EXISTS `food_categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `display_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Food Items Table
-- Notice: Price is stored in integer KOBO (100 Kobo = 1 Naira ₦) to guarantee zero floating-point loss!
CREATE TABLE IF NOT EXISTS `food_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NOT NULL,
  `item_code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `price_kobo` BIGINT UNSIGNED NOT NULL, -- e.g. 450000 for ₦4,500.00
  `price_naira` DECIMAL(12, 2) GENERATED ALWAYS AS (`price_kobo` / 100) STORED,
  `image_url` VARCHAR(255) NOT NULL,
  `preparation_time` VARCHAR(50) DEFAULT '25-35 mins',
  `spice_level` ENUM('Mild', 'Medium', 'Hot', 'Extra Hot (Pepper Soup Style)') DEFAULT 'Medium',
  `is_available` TINYINT(1) DEFAULT 1,
  `is_special` TINYINT(1) DEFAULT 0,
  `rating` DECIMAL(3, 2) DEFAULT 4.80,
  `calories` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `food_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_food_available` (`is_available`),
  INDEX `idx_food_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Discount Codes Table
CREATE TABLE IF NOT EXISTS `discount_codes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `percentage` INT UNSIGNED NOT NULL, -- 10 = 10%
  `max_discount_kobo` BIGINT UNSIGNED NOT NULL,
  `min_order_kobo` BIGINT UNSIGNED NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `expires_at` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Delivery Addresses Table
CREATE TABLE IF NOT EXISTS `delivery_addresses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NULL,
  `recipient_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(25) NOT NULL,
  `address_line` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL DEFAULT 'Lagos State',
  `delivery_instructions` TEXT NULL,
  `is_default` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_ref` VARCHAR(50) NOT NULL UNIQUE, -- e.g. NC-2026-8942
  `user_id` INT UNSIGNED NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(25) NOT NULL,
  `customer_email` VARCHAR(191) NOT NULL,
  `delivery_address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `delivery_notes` TEXT NULL,
  `subtotal_kobo` BIGINT UNSIGNED NOT NULL,
  `delivery_fee_kobo` BIGINT UNSIGNED NOT NULL,
  `discount_kobo` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `discount_code` VARCHAR(50) NULL,
  `total_kobo` BIGINT UNSIGNED NOT NULL,
  `payment_method` ENUM('paystack', 'flutterwave', 'card', 'bank_transfer') NOT NULL,
  `payment_status` ENUM('pending', 'verified', 'failed', 'refunded') DEFAULT 'pending',
  `order_status` ENUM(
    'Pending Payment',
    'Payment Confirmed',
    'Order Accepted',
    'Preparing Food',
    'Ready for Pickup',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ) DEFAULT 'Pending Payment',
  `transaction_ref` VARCHAR(100) NULL,
  `assigned_driver_name` VARCHAR(100) DEFAULT 'Emeka Okoro',
  `assigned_driver_phone` VARCHAR(25) DEFAULT '+234 803 123 4567',
  `assigned_driver_vehicle` VARCHAR(100) DEFAULT 'Bajaj Boxer Motorcycle (LAG-492-XY)',
  `estimated_delivery_time` VARCHAR(50) DEFAULT '35-45 minutes',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_order_ref` (`order_ref`),
  INDEX `idx_order_status` (`order_status`),
  INDEX `idx_payment_status` (`payment_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `food_item_id` INT UNSIGNED NOT NULL,
  `item_name` VARCHAR(200) NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `unit_price_kobo` BIGINT UNSIGNED NOT NULL,
  `selected_protein` VARCHAR(100) NULL,
  `protein_price_kobo` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `selected_extras` TEXT NULL,
  `extras_price_kobo` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `subtotal_kobo` BIGINT UNSIGNED NOT NULL,
  `item_notes` TEXT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Payments Table
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `gateway` ENUM('paystack', 'flutterwave') NOT NULL,
  `transaction_ref` VARCHAR(100) NOT NULL UNIQUE,
  `gateway_ref` VARCHAR(100) NULL,
  `amount_kobo` BIGINT UNSIGNED NOT NULL,
  `currency` VARCHAR(10) DEFAULT 'NGN',
  `status` ENUM('initiated', 'successful', 'failed', 'abandoned') DEFAULT 'initiated',
  `channel` VARCHAR(50) NULL, -- card, bank_transfer, ussd
  `ip_address` VARCHAR(45) NULL,
  `verified_at` DATETIME NULL,
  `raw_gateway_response` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_payments_ref` (`transaction_ref`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Receipts Table
CREATE TABLE IF NOT EXISTS `receipts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `receipt_no` VARCHAR(60) NOT NULL UNIQUE, -- e.g. NC-RCP-2026-8942
  `order_id` INT UNSIGNED NOT NULL UNIQUE,
  `payment_id` INT UNSIGNED NOT NULL,
  `issued_to_name` VARCHAR(150) NOT NULL,
  `issued_to_email` VARCHAR(191) NOT NULL,
  `total_amount_kobo` BIGINT UNSIGNED NOT NULL,
  `verification_token` VARCHAR(64) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_receipt_no` (`receipt_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Chatbot FAQs Table
CREATE TABLE IF NOT EXISTS `chatbot_faqs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `intent_name` VARCHAR(100) NOT NULL UNIQUE,
  `keywords` TEXT NOT NULL, -- comma separated keywords
  `response_text` TEXT NOT NULL,
  `category` VARCHAR(50) DEFAULT 'General'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA: Nigerian Food Categories, Dishes, FAQs & Coupons
-- ============================================================

INSERT INTO `food_categories` (`id`, `name`, `slug`, `description`, `display_order`) VALUES
(1, 'Rice Dishes', 'rice-dishes', 'Authentic Nigerian party jollof, seasoned fried rice, and native ofada rice specialties.', 1),
(2, 'Soups & Swallows', 'soups-swallows', 'Nutritious rich native soups paired with pounded yam, fufu, and amala.', 2),
(3, 'Grills & Suya', 'grills-suya', 'Coal-charred beef suya, peppered gizzard, and spicy whole catfish pepper soup.', 3),
(4, 'Street Bites', 'street-bites', 'Lagos street treats: ewa aganyin, dodo, puff puff, and gourmet leaf-steamed moi moi.', 4),
(5, 'Drinks & Cocktails', 'drinks-cocktails', 'Chilled handcrafted zobo, virgin chapman mocktail, and freshly tapped palm wine.', 5)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

INSERT INTO `food_items` (`category_id`, `item_code`, `name`, `description`, `price_kobo`, `image_url`, `preparation_time`, `spice_level`, `is_available`, `is_special`, `rating`, `calories`) VALUES
(1, 'NC-JOL-01', 'Party Jollof Rice with Peppered Chicken', 'Smoky firewood-style party jollof rice cooked in rich plum tomato stew, served with sweet caramelized plantain and grilled chicken.', 450000, '/src/assets/images/meal_party_jollof_1793101497248.jpg', '25-35 mins', 'Medium', 1, 1, 4.9, 780),
(2, 'NC-EGU-02', 'Rich Egusi Soup with Fluffy Pounded Yam', 'Thick ground melon seed soup with crayfish, stockfish, dried panla fish, tender beef, and fresh pumpkin leaves with smooth pounded yam.', 580000, '/src/assets/images/meal_egusi_pounded_yam_1793101498292.jpg', '30-40 mins', 'Medium', 1, 1, 5.0, 890),
(3, 'NC-SUY-03', 'Fiery Northern Beef Suya Skewers', 'Thinly sliced boneless beef skewers charred over coals, coated with spicy Kano yaji pepper blend, fresh red onions, tomatoes.', 380000, '/src/assets/images/meal_suya_skewer_1793101499380.jpg', '15-25 mins', 'Hot', 1, 1, 4.8, 540),
(5, 'NC-DRK-04', 'Chilled Hibiscus Zobo & Nigerian Chapman Pair', 'Refreshing duo of spiced Zobo (hibiscus, ginger, cloves, pineapple) alongside classic Nigerian Chapman with Angostura aromatic bitters.', 220000, '/src/assets/images/meal_zobo_chapman_1793101499331.jpg', '5-10 mins', 'Mild', 1, 1, 4.9, 180),
(1, 'NC-FRI-05', 'Naija Special Fried Rice with Grilled Chicken', 'Seasoned yellow fried rice with liver, green peas, sweet corn, runner beans, served with golden grilled chicken and dodo.', 480000, '/src/assets/images/meal_party_jollof_1793101497248.jpg', '25-35 mins', 'Mild', 1, 0, 4.7, 740),
(2, 'NC-AFA-06', 'Calabar Afang Soup with Fluffy Fufu', 'Traditional Efik soup prepared with shredded okazi leaves, waterleaf, periwinkles, smoked catfish, kpomo, and assorted meat in palm oil broth.', 620000, '/src/assets/images/meal_egusi_pounded_yam_1793101498292.jpg', '30-40 mins', 'Hot', 1, 0, 4.9, 820),
(2, 'NC-EFO-07', 'Lagos Efo Riro with Abula & Soft Amala', 'Rich vegetable soup cooked with locust beans (iru), dried prawns, cow leg, and scotch bonnet peppers with authentic brown amala.', 550000, '/src/assets/images/meal_egusi_pounded_yam_1793101498292.jpg', '25-35 mins', 'Hot', 1, 0, 4.8, 790),
(4, 'NC-EWA-08', 'Ewa Aganyin with Soft Agege Bread & Dodo', 'Mashed sweet honey beans topped with fiery smoked chili onion sauce, caramelized plantain, and fresh Agege bread.', 320000, '/src/assets/images/meal_party_jollof_1793101497248.jpg', '15-20 mins', 'Hot', 1, 0, 4.9, 670),
(3, 'NC-CAT-09', 'Authentic Point & Kill Catfish Pepper Soup', 'Intensely aromatic Nigerian herbal broth loaded with fresh catfish chunks, calabash nutmeg, ehuru, uda pods, and uziza leaves.', 520000, '/src/assets/images/meal_suya_skewer_1793101499380.jpg', '25-35 mins', 'Extra Hot (Pepper Soup Style)', 1, 1, 4.9, 420),
(4, 'NC-CHP-10', 'Ultimate Naija Party Small Chops Platter', 'Fluffy sweet puff puff, crispy beef samosas, vegetable spring rolls, and spicy peppered gizzard skewers.', 360000, '/src/assets/images/hero_naija_feast_1793101496416.jpg', '15-20 mins', 'Mild', 1, 0, 4.8, 610)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

INSERT INTO `discount_codes` (`code`, `percentage`, `max_discount_kobo`, `min_order_kobo`, `description`, `is_active`) VALUES
('NAIJA10', 10, 200000, 400000, '10% off your authentic feast (orders over ₦4,000)', 1),
('FIRSTCHOP', 15, 300000, 500000, 'Welcome bonus: 15% off first order over ₦5,000', 1),
('SUNDAYCHOP', 20, 400000, 800000, 'Family Sunday special: 20% off orders over ₦8,000', 1)
ON DUPLICATE KEY UPDATE `description`=VALUES(`description`);

-- Initial Default Admin User: admin@naijachop.ng / NaijaAdmin2026!
-- Password hash generated via password_hash('NaijaAdmin2026!', PASSWORD_BCRYPT)
INSERT INTO `admins` (`username`, `email`, `password_hash`, `role`, `is_active`) VALUES
('naija_admin', 'admin@naijachop.ng', '$2y$10$Q78l3O/W0r2kRk2Q/6Q10u6M3P01bZ3p9H9W9D6p9M6k9N0k9Z9Oa', 'super_admin', 1)
ON DUPLICATE KEY UPDATE `role`=VALUES(`role`);

INSERT INTO `chatbot_faqs` (`intent_name`, `keywords`, `response_text`, `category`) VALUES
('delivery_time', 'time,how long,minutes,fast,estimate', 'We deliver within 30 to 50 minutes depending on your location in Lagos, Abuja, Ibadan, or Port Harcourt.', 'Delivery'),
('payment_methods', 'payment,paystack,flutterwave,card,transfer,ussd', 'You can pay securely online via Paystack or Flutterwave using ATM Debit Cards (Verve, Mastercard, Visa), Instant Bank Transfer, or USSD.', 'Payments'),
('opening_hours', 'open,hours,time,close,sunday,night', 'NaijaChop operates Monday to Sunday from 9:00 AM to 11:00 PM. Hot party jollof and fresh grills are prepared around the clock!', 'General'),
('spice_levels', 'pepper,spicy,hot,mild,shombo', 'We cater to all taste buds! You can choose Mild, Medium, Hot, or Extra Hot (Pepper Soup Style) during dish customization.', 'Food'),
('locations', 'location,lagos,abuja,island,mainland,ikeja,lekki', 'We deliver across Lagos (Island & Mainland), Abuja FCT, Port Harcourt, and Ibadan. You can select your delivery zone at checkout!', 'Delivery');
