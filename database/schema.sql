-- ============================================================
-- Burn IT Out Fitness - Database Schema
-- ============================================================
-- Run this file to set up the database from scratch.
-- Steps:
--   1. Create a MySQL database (e.g., burnit_db)
--   2. Run: mysql -u root -p burnit_db < database/schema.sql
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Table: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT(11)      NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(255) NOT NULL,
  `email`      VARCHAR(255) NOT NULL UNIQUE,
  `password`   VARCHAR(255) NOT NULL,
  `role`       ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: courses
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `courses` (
  `id`          INT(11)      NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(255) NOT NULL,
  `description` TEXT,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: modules (chapters inside a course)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `modules` (
  `id`          INT(11)      NOT NULL AUTO_INCREMENT,
  `course_id`   INT(11)      NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `order_index` INT(11)      NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: videos (lessons inside a module)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `videos` (
  `id`          INT(11)      NOT NULL AUTO_INCREMENT,
  `course_id`   INT(11)      DEFAULT NULL,
  `module_id`   INT(11)      DEFAULT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `youtube_id`  VARCHAR(255) NOT NULL,
  `order_index` INT(11)      NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: user_courses (which user is assigned to which course)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_courses` (
  `id`          INT(11)   NOT NULL AUTO_INCREMENT,
  `user_id`     INT(11)   NOT NULL,
  `course_id`   INT(11)   NOT NULL,
  `assigned_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_assignment` (`user_id`, `course_id`),
  FOREIGN KEY (`user_id`)   REFERENCES `users`(`id`)   ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Seed Data — Starter admin account & sample course
-- ============================================================
-- Default admin password is:  admin123
-- (bcrypt hash of 'admin123' with 10 salt rounds)
-- CHANGE THIS PASSWORD after first login!
-- ============================================================

INSERT IGNORE INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Admin', 'admin@burnit.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uArMvm2a6', 'admin');

INSERT IGNORE INTO `courses` (`id`, `title`, `description`) VALUES
(1, '21-Day Fat Burn Challenge', 'A complete 21-day program to burn fat and build endurance.');

INSERT IGNORE INTO `modules` (`id`, `course_id`, `title`, `order_index`) VALUES
(1, 1, 'Week 1 – Foundation', 1),
(2, 1, 'Week 2 – Intensity', 2),
(3, 1, 'Week 3 – Peak Performance', 3);

INSERT IGNORE INTO `videos` (`course_id`, `module_id`, `title`, `youtube_id`, `order_index`) VALUES
(1, 1, 'Welcome & Overview',     'Ez3n8aRRbw4', 1),
(1, 1, 'Day 1 – Full Body Burn', 'Ez3n8aRRbw4', 2);
