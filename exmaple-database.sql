-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 16, 2024 at 06:36 PM
-- Server version: 8.0.20-0ubuntu0.19.10.1
-- PHP Version: 7.3.11-0ubuntu0.19.10.6

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `maou-all-star`
--

-- --------------------------------------------------------

--
-- Table structure for table `allstarImages`
--

CREATE TABLE `allstarImages` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `imageURL` text COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `score` float NOT NULL DEFAULT '1500',
  `name` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `series_name` varchar(100) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_520_ci,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Dumping data for table `allstarImages`
--

INSERT INTO `allstarImages` (`id`, `userId`, `imageURL`, `score`, `name`, `series_name`, `description`, `last_update`) VALUES
(1, 2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQVEgKdWzOUM9-QO9KoaVLddrUbte3wyCpDg&s', 1484, 'Sadao Maou', NULL, NULL, '2024-08-16 11:29:37'),
(2, 2, 'https://static1.dualshockersimages.com/wordpress/wp-content/uploads/2023/01/the-misfit-of-demon-king-academy-season-2-episode-4.jpg', 1484, 'Arnos', NULL, NULL, '2024-08-16 11:30:53'),
(3, 3, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt22KNedu8pnxGoEAndfjZ14AhHFokWokN1Q&s', 1516, 'Janos', NULL, NULL, '2024-08-16 11:32:49'),
(4, 3, 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2019/07/Feature-Saitama-vs-Chewing-Gum.jpg', 1516, 'Saitama', NULL, NULL, '2024-08-16 11:33:08');

-- --------------------------------------------------------

--
-- Table structure for table `allstarSettings`
--

CREATE TABLE `allstarSettings` (
  `id` int NOT NULL,
  `MaxImagePerUser` int NOT NULL,
  `ASTime` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Dumping data for table `allstarSettings`
--

INSERT INTO `allstarSettings` (`id`, `MaxImagePerUser`, `ASTime`) VALUES
(1, 5, 30);

-- --------------------------------------------------------

--
-- Table structure for table `allstarUsers`
--

CREATE TABLE `allstarUsers` (
  `userId` int NOT NULL,
  `username` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `password` text COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `displayName` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `image` text COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_520_ci,
  `type` enum('admin','user') COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'user',
  `joinDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Dumping data for table `allstarUsers`
--

-- password: 1234
INSERT INTO `allstarUsers` (`userId`, `username`, `password`, `displayName`, `image`, `note`, `type`, `joinDate`) VALUES
(1, 'Maou', '$2b$10$uD5aXnZl4lmh7KzlFgEQ3.2vIsG5hkZsjT0rlaOBwGqWP94lR7of.', 'Maou', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp_MS_1A3JiB3KRCq-oFy93TIPsD4dwsJoAg&s', NULL, 'user', '2024-08-16 11:19:19'),
(2, 'Maou2', '$2b$10$pVfwbcf5J61T5LlxuaeqjeAJ9.urtG/Hthyb84tjkLJPYweDdfYVS', 'Maou', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp_MS_1A3JiB3KRCq-oFy93TIPsD4dwsJoAg&s', NULL, 'user', '2024-08-16 11:27:39'),
(3, 'Janos1', '$2b$10$5ZEgEKti.uDVRVvvYZy1WOGNCok5ojit4HIeD6HegwYtgRd4/tuOy', 'Janos1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt22KNedu8pnxGoEAndfjZ14AhHFokWokN1Q&s', NULL, 'user', '2024-08-16 11:32:27');

-- --------------------------------------------------------

--
-- Table structure for table `allstarVoting`
--

CREATE TABLE `allstarVoting` (
  `vid` int NOT NULL,
  `userId` int DEFAULT NULL,
  `browserId` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `imageId` int NOT NULL,
  `score` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Dumping data for table `allstarVoting`
--

INSERT INTO `allstarVoting` (`vid`, `userId`, `browserId`, `imageId`, `score`, `timestamp`) VALUES
(1, 3, NULL, 4, 1516, '2024-08-16 11:33:54'),
(2, 3, NULL, 1, 1484, '2024-08-16 11:33:54'),
(3, 3, NULL, 2, 1484, '2024-08-16 11:33:56'),
(4, 3, NULL, 3, 1516, '2024-08-16 11:33:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `allstarImages`
--
ALTER TABLE `allstarImages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `allstarSettings`
--
ALTER TABLE `allstarSettings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `allstarUsers`
--
ALTER TABLE `allstarUsers`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `allstarVoting`
--
ALTER TABLE `allstarVoting`
  ADD PRIMARY KEY (`vid`),
  ADD KEY `voting_imageId` (`imageId`),
  ADD KEY `voting_userId` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `allstarImages`
--
ALTER TABLE `allstarImages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `allstarSettings`
--
ALTER TABLE `allstarSettings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `allstarUsers`
--
ALTER TABLE `allstarUsers`
  MODIFY `userId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `allstarVoting`
--
ALTER TABLE `allstarVoting`
  MODIFY `vid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `allstarImages`
--
ALTER TABLE `allstarImages`
  ADD CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `allstarUsers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `allstarVoting`
--
ALTER TABLE `allstarVoting`
  ADD CONSTRAINT `voting_imageId` FOREIGN KEY (`imageId`) REFERENCES `allstarImages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `voting_userId` FOREIGN KEY (`userId`) REFERENCES `allstarUsers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
