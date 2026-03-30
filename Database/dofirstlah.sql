-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 26, 2025 at 03:35 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dofirstlah`
--

-- --------------------------------------------------------

--
-- Table structure for table `attachment`
--

CREATE TABLE `attachment` (
  `AttachmentID` varchar(10) NOT NULL,
  `UploadedBy` varchar(10) NOT NULL,
  `FileName` varchar(255) DEFAULT NULL,
  `FileType` varchar(100) NOT NULL,
  `FileSize` int(10) UNSIGNED NOT NULL,
  `FilePath` varchar(500) NOT NULL,
  `UploadTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='store attachments';

--
-- Dumping data for table `attachment`
--

INSERT INTO `attachment` (`AttachmentID`, `UploadedBy`, `FileName`, `FileType`, `FileSize`, `FilePath`, `UploadTime`) VALUES
('A021', 'USR003', 'image.png', 'image/png', 59553, 'Attachments/A021_image.png', '2025-10-23 18:59:02'),
('A022', 'USR003', 'image.png', 'image/png', 115952, 'Attachments/A022_image.png', '2025-10-23 19:01:02'),
('A023', 'USR003', 'image.png', 'image/png', 4494, 'Attachments/A023_image.png', '2025-10-23 19:03:35'),
('A024', 'USR003', 'mark1.png', 'image/png', 914178, 'Attachments/A024_mark1.png', '2025-10-23 19:23:28'),
('A025', 'USR003', '劇場版『チェンソーマン レゼ篇』公開記念PV／Ending Theme 米津玄師 宇多田ヒカル「JANE DOE」Chainsaw Man – The Movie Reze Arc”.mp4', 'video/mp4', 16603362, 'Attachments/A025___________________________________________________________PV___Ending_Theme___________________________________JANE_DOE___Chainsaw_Man_____The_Movie_Reze_Arc___.mp4', '2025-10-23 19:23:28'),
('A026', 'USR003', 'image.png', 'image/png', 189388, 'Attachments/A026_image.png', '2025-10-24 13:31:42'),
('A027', 'USR003', 'image.png', 'image/png', 223442, 'Attachments/A027_image.png', '2025-10-24 13:33:00'),
('A032', 'USR003', '01e445d6e347c3458c36060e29013ee7.jpg', 'JPG', 46468, 'Attachments/ATT_68fba37c61b26_01e445d6e347c3458c36060e29013ee7.jpg', '2025-10-25 00:04:12'),
('A036', 'USR003', 'jqma-16-1-paper3.pdf', 'PDF', 479879, 'Attachments/ATT_68fcca4f4e0b0_jqma-16-1-paper3.pdf', '2025-10-25 21:02:07'),
('A037', 'USR003', '01e445d6e347c3458c36060e29013ee7.jpg', 'JPG', 46468, 'Attachments/ATT_68fccc268ce8a_01e445d6e347c3458c36060e29013ee7.jpg', '2025-10-25 21:09:58'),
('A040', 'USR003', '01e445d6e347c3458c36060e29013ee7.jpg', 'JPG', 46468, 'Attachments/ATT_68fcdc702a17f_01e445d6e347c3458c36060e29013ee7.jpg', '2025-10-25 22:19:28'),
('A041', 'USR002', '劇場版『チェンソーマン レゼ篇』公開記念PV／Ending Theme 米津玄師 宇多田ヒカル「JANE DOE」Chainsaw Man – The Movie Reze Arc”.mp4', 'MP4', 16603362, 'Attachments/ATT_68fdcde01a370_劇場版『チェンソーマン レゼ篇』公開記念PV／Ending Theme 米津玄師 宇多田ヒカル「JANE DOE」Chainsaw Man – The Movie Reze Arc”.mp4', '2025-10-26 15:29:36');

-- --------------------------------------------------------

--
-- Table structure for table `commentattachments`
--

CREATE TABLE `commentattachments` (
  `CommentID` varchar(10) NOT NULL,
  `AttachmentID` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `commentattachments`
--

INSERT INTO `commentattachments` (`CommentID`, `AttachmentID`) VALUES
('CD001', 'A021'),
('CD002', 'A022'),
('CD003', 'A023'),
('CD007', 'A024'),
('CD007', 'A025'),
('CD010', 'A027');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `CommentID` varchar(10) NOT NULL,
  `UserID` varchar(10) NOT NULL,
  `TaskID` varchar(10) NOT NULL,
  `CreatedAt` datetime NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='store comments';

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`CommentID`, `UserID`, `TaskID`, `CreatedAt`, `Description`) VALUES
('CD001', 'USR003', 'T001', '2025-10-23 18:59:02', '<span class=\"file-preview\" contenteditable=\"false\" draggable=\"true\" data-type=\"image/png\" style=\"display: block;\"><img src=\"Attachments/A021_image.png\" alt=\"image.png\"></span>'),
('CD002', 'USR003', 'T001', '2025-10-23 19:01:02', '<span class=\"file-preview\" contenteditable=\"false\" draggable=\"true\" data-type=\"image/png\" style=\"display: block;\"><img src=\"Attachments/A022_image.png\" alt=\"image.png\"></span><p>ABC</p>'),
('CD003', 'USR003', 'T001', '2025-10-23 19:03:35', '<span class=\"file-preview\" contenteditable=\"false\" draggable=\"true\" data-type=\"image/png\" style=\"display: block;\"><img src=\"Attachments/A023_image.png\" alt=\"image.png\"></span>'),
('CD004', 'USR003', 'T001', '2025-10-23 19:04:07', '<p>TESTING</p>'),
('CD005', 'USR003', 'T002', '2025-10-23 19:06:53', '<p>Testing2</p><p>avc</p>'),
('CD006', 'USR003', 'T002', '2025-10-23 19:07:08', '<p>abc</p>'),
('CD007', 'USR003', 'T001', '2025-10-23 19:23:28', '<p>Les watch movie \r\n<span class=\"file-preview\" contenteditable=\"false\" draggable=\"true\" data-type=\"image/png\" style=\"display: block;\"><img src=\"Attachments/A024_mark1.png\" alt=\"mark1.png\"></span><p>this is inline preview </p><p>hahahahahahhahaahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh</p>\r\n</p>'),
('CD008', 'USR003', 'T001', '2025-10-24 13:30:16', '<p>abc</p>'),
('CD010', 'USR003', 'T001', '2025-10-24 13:33:00', '<span class=\"file-preview\" contenteditable=\"false\" draggable=\"true\" data-type=\"image/png\" style=\"display: block;\"><img src=\"Attachments/A027_image.png\" alt=\"image.png\"></span>'),
('CD011', 'USR003', 'T002', '2025-10-26 14:25:24', '<p>abc</p>'),
('CD012', 'USR003', 'T002', '2025-10-26 14:26:44', '<p>comment testing</p>'),
('CD013', 'USR003', 'T002', '2025-10-26 14:27:25', '<p>testing2</p>'),
('CD014', 'USR003', 'T002', '2025-10-26 14:28:30', '<p>abc</p>');

-- --------------------------------------------------------

--
-- Table structure for table `finalworkattachment`
--

CREATE TABLE `finalworkattachment` (
  `TaskID` varchar(10) NOT NULL,
  `AttachmentID` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Store Final Work in task';

--
-- Dumping data for table `finalworkattachment`
--

INSERT INTO `finalworkattachment` (`TaskID`, `AttachmentID`) VALUES
('T002', 'A032'),
('T007', 'A037'),
('T008', 'A041'),
('T009', 'A036'),
('T010', 'A040');

-- --------------------------------------------------------

--
-- Table structure for table `projectmembers`
--

CREATE TABLE `projectmembers` (
  `ProjectID` varchar(10) NOT NULL,
  `UserID` varchar(10) NOT NULL,
  `Role` enum('Team Leader','Project Manager','Team Member','') NOT NULL DEFAULT 'Team Member',
  `Status` enum('Active','Removed','Pending','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Store members in project';

--
-- Dumping data for table `projectmembers`
--

INSERT INTO `projectmembers` (`ProjectID`, `UserID`, `Role`, `Status`) VALUES
('P001', 'USR002', 'Project Manager', 'Active'),
('P001', 'USR003', 'Team Leader', 'Active'),
('P001', 'USR004', 'Team Member', 'Active'),
('P001', 'USR005', 'Team Member', 'Active'),
('P002', 'USR003', 'Team Leader', 'Active'),
('P003', 'USR002', 'Team Member', 'Active'),
('P003', 'USR003', 'Team Leader', 'Active'),
('P003', 'USR004', '', 'Pending'),
('P003', 'USR005', '', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `ProjectID` varchar(10) NOT NULL,
  `ProjectName` varchar(100) NOT NULL,
  `InviteCode` varchar(50) NOT NULL,
  `Description` text DEFAULT 'Description. Say Somethin',
  `StartDate` datetime NOT NULL DEFAULT current_timestamp(),
  `EndDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='store projects';

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`ProjectID`, `ProjectName`, `InviteCode`, `Description`, `StartDate`, `EndDate`) VALUES
('P001', 'RWDD', 'ALqocyVWH4bC95fL3dfNEQ==', 'Assignment. Need to rush before 2nov', '2025-10-20 05:46:16', '2025-11-28 16:00:00'),
('P002', 'Build Lanyeye 3d', 'ED0c1gwhjZjsIxCHBQNQdQ==', 'Description. Say Somethin', '2025-10-20 05:46:35', NULL),
('P003', 'Testing', 'd16PyBJIaqZKVZ6SjoJpOg==', 'Description. Say Somethin', '2025-10-26 14:30:43', '2025-10-31 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `rememberme`
--

CREATE TABLE `rememberme` (
  `UserID` varchar(10) NOT NULL,
  `Token` varchar(64) NOT NULL,
  `Expiry` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='store rememberMe token';

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `TaskID` varchar(10) NOT NULL,
  `ParentTaskID` varchar(10) DEFAULT NULL,
  `ProjectID` varchar(10) NOT NULL,
  `AssignedUserID` varchar(10) DEFAULT NULL,
  `TaskTitle` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `Priority` int(1) UNSIGNED NOT NULL DEFAULT 0,
  `Status` enum('HTY','OTW','DONE','CANCELLED') NOT NULL DEFAULT 'HTY',
  `StartDate` datetime NOT NULL,
  `DueDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='store task';

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`TaskID`, `ParentTaskID`, `ProjectID`, `AssignedUserID`, `TaskTitle`, `Description`, `Priority`, `Status`, `StartDate`, `DueDate`) VALUES
('T001', NULL, 'P001', 'USR003', 'Wireframe Designed', 'Hello Brodwcqe qw ', 4, 'OTW', '2025-10-22 08:00:00', '2025-10-22 08:00:00'),
('T002', NULL, 'P001', 'USR003', 'Storyboard Design', '', 0, 'DONE', '2025-10-22 08:00:00', '2025-10-23 08:00:00'),
('T003', NULL, 'P001', NULL, 'Testing', '', 0, 'CANCELLED', '2025-10-21 15:40:05', '2025-10-22 18:00:00'),
('T004', NULL, 'P001', NULL, 'Testing2', '', 0, 'CANCELLED', '2025-10-21 15:41:17', '2025-10-28 17:00:00'),
('T005', NULL, 'P001', 'USR003', 'Backend Logic', '', 1, 'HTY', '2025-10-23 08:00:00', '2025-10-25 08:00:00'),
('T006', NULL, 'P001', 'USR003', 'Database Set Up', '', 0, 'HTY', '2025-10-24 08:00:00', '2025-10-29 08:00:00'),
('T007', 'T001', 'P001', 'USR005', 'Testing', '', 1, 'HTY', '2025-10-25 08:00:00', '2025-10-29 08:00:00'),
('T008', 'T001', 'P001', 'USR002', 'ABC', '', 3, 'OTW', '2025-10-25 08:00:00', '2025-11-03 08:00:00'),
('T009', 'T006', 'P001', 'USR003', 'Data Creation', '', 0, 'CANCELLED', '2025-10-25 15:01:00', '2025-10-26 14:01:00'),
('T010', 'T006', 'P001', 'USR003', 'ABC', '', 2, 'HTY', '2025-10-30 08:00:00', '2025-10-31 08:00:00'),
('T011', NULL, 'P001', NULL, 'Javascript Logic', '', 0, 'CANCELLED', '2025-10-26 10:13:02', '2025-10-26 17:00:00'),
('T012', NULL, 'P001', NULL, 'Testing2', '', 0, 'HTY', '2025-11-01 08:00:00', '2025-11-02 08:00:00'),
('T013', NULL, 'P003', 'USR003', 'abc', '', 1, 'OTW', '2025-10-25 08:00:00', '2025-10-26 08:00:00'),
('T014', NULL, 'P003', NULL, 'PPC', '', 0, 'HTY', '2025-10-26 15:24:29', '2025-10-30 17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `userevents`
--

CREATE TABLE `userevents` (
  `EventID` varchar(10) NOT NULL,
  `UserID` varchar(10) NOT NULL,
  `EventTitle` varchar(100) NOT NULL,
  `EventDescription` text DEFAULT NULL,
  `Style` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Store event ';

--
-- Dumping data for table `userevents`
--

INSERT INTO `userevents` (`EventID`, `UserID`, `EventTitle`, `EventDescription`, `Style`, `StartDate`, `EndDate`) VALUES
('E001', 'USR003', 'Bouldering at Bump', 'ABC\nascoqwbboqwdsv\nd d\n \nds ascascq', 3, '2025-10-24 18:45:00', '2025-10-24 21:00:00'),
('E002', 'USR003', 'Movie Night', '', 1, '2025-10-19 22:00:00', '2025-10-19 23:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `userreminders`
--

CREATE TABLE `userreminders` (
  `ReminderID` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `UserID` varchar(10) NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `RemindAt` datetime NOT NULL,
  `Status` enum('Pending','Completed') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Store reminder';

--
-- Dumping data for table `userreminders`
--

INSERT INTO `userreminders` (`ReminderID`, `UserID`, `Title`, `Description`, `RemindAt`, `Status`) VALUES
('R001', 'USR003', 'Testing', '', '2025-10-20 01:00:00', 'Completed'),
('R002', 'USR003', 'Testing2', '', '2025-10-20 01:00:00', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` varchar(10) NOT NULL,
  `FullName` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `SecurityQuestion` enum('pet','school','food','color') NOT NULL,
  `SecurityAnswer` text NOT NULL,
  `AvatarColor` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '''--avatar-color-1'''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FullName`, `Email`, `Password`, `SecurityQuestion`, `SecurityAnswer`, `AvatarColor`) VALUES
('USR002', 'Ady Then', 'adythen@gmail.com', '$2y$10$XwJ20ww0mjUxvH1Qv4chSu0qOii9Vw8UNFZLDVxgtWqpA9pH7ulV2', 'pet', '$2y$10$a6GHxIM85wlIo4NNr/mAIOVMlRsuxG8HBptHKnkCXOkT8qp3GPGSi', '--avatar-color7'),
('USR003', 'Lim Jun Hong', 'limjunhong1015@gmail.com', '$2y$10$uFgi4ZeqyjghLrKXxx4s7eySpRy/kowLrHfVXEWrjWTTwjbxchQWy', 'food', '$2y$10$K.RM1AfSrnlnfwo2Sq9yVegnFDiP6/BGbWKnKtZ8sv6FVdlj6O3pO', '--avatar-color2'),
('USR004', 'Lau Hoe Yik', 'lauhoeyik@gmail.com', '$2y$10$qsjvE3yBU5q.MswiAuPYJejx0hCeRwG5qbdnyHIho7Ej65M6ZB7a.', 'food', '$2y$10$9NLecRMhFu3dapC0dCYE2.bd02Kix9rWuoFCr5zxADAkuHDx0fjty', '--avatar-color19'),
('USR005', 'Eason Mok Yu Sheng', 'mokyusheng@gmail.com', '$2y$10$itdx/NRIj0yJe1NwOJON9eim8C18KTLd.GzFsNw21GArPq8A6kgk2', 'color', '$2y$10$AJ58fRx3LpDiXOTCHApol.RDqkyb1X9iMn4VAXM4qUfTIYXQmR3sK', '--avatar-color18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attachment`
--
ALTER TABLE `attachment`
  ADD PRIMARY KEY (`AttachmentID`),
  ADD KEY `userID` (`UploadedBy`);

--
-- Indexes for table `commentattachments`
--
ALTER TABLE `commentattachments`
  ADD PRIMARY KEY (`CommentID`,`AttachmentID`),
  ADD KEY `AttachmentID` (`AttachmentID`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`CommentID`),
  ADD KEY `userID` (`UserID`),
  ADD KEY `TaskID` (`TaskID`);

--
-- Indexes for table `finalworkattachment`
--
ALTER TABLE `finalworkattachment`
  ADD PRIMARY KEY (`TaskID`,`AttachmentID`),
  ADD KEY `AttachmentID` (`AttachmentID`);

--
-- Indexes for table `projectmembers`
--
ALTER TABLE `projectmembers`
  ADD PRIMARY KEY (`ProjectID`,`UserID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`ProjectID`),
  ADD UNIQUE KEY `inviteCode` (`InviteCode`);

--
-- Indexes for table `rememberme`
--
ALTER TABLE `rememberme`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `token` (`Token`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`TaskID`),
  ADD KEY `parentTaskID` (`ParentTaskID`),
  ADD KEY `projectID` (`ProjectID`),
  ADD KEY `userID` (`AssignedUserID`);

--
-- Indexes for table `userevents`
--
ALTER TABLE `userevents`
  ADD PRIMARY KEY (`EventID`),
  ADD KEY `userID` (`UserID`);

--
-- Indexes for table `userreminders`
--
ALTER TABLE `userreminders`
  ADD PRIMARY KEY (`ReminderID`),
  ADD KEY `userID` (`UserID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `email` (`Email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attachment`
--
ALTER TABLE `attachment`
  ADD CONSTRAINT `attachment_ibfk_1` FOREIGN KEY (`UploadedBy`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `commentattachments`
--
ALTER TABLE `commentattachments`
  ADD CONSTRAINT `commentattachments_ibfk_1` FOREIGN KEY (`AttachmentID`) REFERENCES `attachment` (`AttachmentID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `commentattachments_ibfk_2` FOREIGN KEY (`CommentID`) REFERENCES `comments` (`CommentID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`TaskID`) REFERENCES `tasks` (`TaskID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `finalworkattachment`
--
ALTER TABLE `finalworkattachment`
  ADD CONSTRAINT `finalworkattachment_ibfk_1` FOREIGN KEY (`AttachmentID`) REFERENCES `attachment` (`AttachmentID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `finalworkattachment_ibfk_2` FOREIGN KEY (`TaskID`) REFERENCES `tasks` (`TaskID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `projectmembers`
--
ALTER TABLE `projectmembers`
  ADD CONSTRAINT `projectmembers_ibfk_1` FOREIGN KEY (`ProjectID`) REFERENCES `projects` (`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `projectmembers_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rememberme`
--
ALTER TABLE `rememberme`
  ADD CONSTRAINT `rememberme_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`ParentTaskID`) REFERENCES `tasks` (`TaskID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`ProjectID`) REFERENCES `projects` (`ProjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_3` FOREIGN KEY (`AssignedUserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userevents`
--
ALTER TABLE `userevents`
  ADD CONSTRAINT `userevents_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userreminders`
--
ALTER TABLE `userreminders`
  ADD CONSTRAINT `userreminders_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
