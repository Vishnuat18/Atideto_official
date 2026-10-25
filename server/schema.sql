-- Atideto Technologies Enterprise ERP Database Schema
-- Host: localhost:3306
-- Database: atideto
-- User: root

CREATE DATABASE IF NOT EXISTS `atideto` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `atideto`;

-- 1. USERS TABLE (Supports both SQL Login and Google OAuth)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uid` VARCHAR(128) UNIQUE NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  `role` VARCHAR(50) DEFAULT 'student',
  `provider` VARCHAR(50) DEFAULT 'sql',
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. STUDENTS TABLE (Mahendra Engineering College Cohort + Registrations)
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(50) UNIQUE NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `college` VARCHAR(255) DEFAULT 'Mahendra Engineering College',
  `degree` VARCHAR(255) DEFAULT 'B.Tech Information Technology',
  `grad_year` VARCHAR(10) DEFAULT '2027',
  `course` VARCHAR(255) NOT NULL,
  `domain` VARCHAR(255) NOT NULL,
  `start_date` VARCHAR(50) DEFAULT '25 Oct 2026',
  `batch` VARCHAR(50) DEFAULT '2026-MEC',
  `status` VARCHAR(50) DEFAULT 'Verified Enrolled',
  `internship_status` VARCHAR(100) DEFAULT 'Active Industrial Track',
  `internship_duration` VARCHAR(50) DEFAULT '3 Months',
  `mentor` VARCHAR(255) DEFAULT 'Karthik Ramanathan (AI & Web Lead)',
  `attendance` INT DEFAULT 95,
  `score` INT DEFAULT 95,
  `enrolled_date` VARCHAR(50) DEFAULT '2026-10-21',
  `fee_paid` VARCHAR(50) DEFAULT '₹34,000',
  `fee_total` VARCHAR(50) DEFAULT '₹34,000',
  `payment_status` VARCHAR(50) DEFAULT 'Paid in Full',
  `tools` JSON DEFAULT NULL,
  `area` JSON DEFAULT NULL,
  `cert_id` VARCHAR(100) DEFAULT NULL,
  `offer_no` VARCHAR(100) DEFAULT NULL,
  `issue_date` VARCHAR(50) DEFAULT NULL,
  `cert_generated` TINYINT(1) DEFAULT 0,
  `sent_to_administration` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_students_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. REGISTRATIONS TABLE (4-Stepper Submissions)
CREATE TABLE IF NOT EXISTS `registrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reg_id` VARCHAR(50) UNIQUE NOT NULL,
  `student_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `college` VARCHAR(255) DEFAULT 'Mahendra Engineering College',
  `degree` VARCHAR(255) DEFAULT 'B.Tech Information Technology',
  `grad_year` VARCHAR(10) DEFAULT '2027',
  `course_interest` VARCHAR(255) DEFAULT 'Full Stack Web Development',
  `domain` VARCHAR(255) DEFAULT 'Full Stack Development',
  `mode` VARCHAR(50) DEFAULT 'Industrial Hybrid',
  `step_status` VARCHAR(50) DEFAULT 'Completed (Step 4/4)',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_registrations_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. COURSES TABLE
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_code` VARCHAR(50) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `duration` VARCHAR(50) NOT NULL,
  `level` VARCHAR(50) NOT NULL,
  `price` VARCHAR(50) NOT NULL,
  `rating` DECIMAL(3,2) DEFAULT 4.90,
  `students_count` INT DEFAULT 120,
  `status` VARCHAR(50) DEFAULT 'Active',
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. INTERNSHIPS TABLE
CREATE TABLE IF NOT EXISTS `internships` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `internship_code` VARCHAR(50) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `domain` VARCHAR(100) NOT NULL,
  `company` VARCHAR(255) DEFAULT 'Atideto Technologies',
  `duration` VARCHAR(50) NOT NULL,
  `stipend` VARCHAR(50) DEFAULT 'Performance Based Stipend',
  `mode` VARCHAR(50) DEFAULT 'Hybrid / Remote',
  `vacancies` INT DEFAULT 15,
  `status` VARCHAR(50) DEFAULT 'Open',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. STAFF / EMPLOYEES TABLE
CREATE TABLE IF NOT EXISTS `staff` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `emp_id` VARCHAR(50) UNIQUE NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `role` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'Active',
  `assigned_students` INT DEFAULT 0,
  `account_holder` VARCHAR(255) DEFAULT NULL,
  `account_no` VARCHAR(100) DEFAULT NULL,
  `ifsc_code` VARCHAR(50) DEFAULT NULL,
  `branch` VARCHAR(255) DEFAULT NULL,
  `upi_link` VARCHAR(255) DEFAULT NULL,
  `scanner_image` MEDIUMTEXT DEFAULT NULL,
  `instagram` VARCHAR(255) DEFAULT NULL,
  `facebook` VARCHAR(255) DEFAULT NULL,
  `linkedin` VARCHAR(255) DEFAULT NULL,
  `portfolio` VARCHAR(255) DEFAULT NULL,
  `other_socials` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. CLIENTS & ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS `clients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_id` VARCHAR(50) UNIQUE NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `industry` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `mou_status` VARCHAR(50) DEFAULT 'Active MOU',
  `active_projects` INT DEFAULT 1,
  `contract_value` VARCHAR(50) DEFAULT '₹5,00,000',
  `pipeline_status` VARCHAR(100) DEFAULT 'In Progress',
  `tools` JSON DEFAULT NULL,
  `area` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. TASKS TABLE
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `task_id` VARCHAR(50) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `assignee` VARCHAR(255) NOT NULL,
  `priority` VARCHAR(50) DEFAULT 'Medium',
  `status` VARCHAR(50) DEFAULT 'In Progress',
  `due_date` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cert_id` VARCHAR(100) UNIQUE NOT NULL,
  `student_name` VARCHAR(255) NOT NULL,
  `college` VARCHAR(255) NOT NULL,
  `degree` VARCHAR(255) NOT NULL,
  `domain` VARCHAR(255) NOT NULL,
  `issue_date` VARCHAR(50) NOT NULL,
  `duration` VARCHAR(50) NOT NULL,
  `grade` VARCHAR(50) NOT NULL,
  `verify_url` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `txn_id` VARCHAR(100) UNIQUE NOT NULL,
  `student_name` VARCHAR(255) NOT NULL,
  `amount` VARCHAR(50) NOT NULL,
  `method` VARCHAR(50) DEFAULT 'UPI / NetBanking',
  `status` VARCHAR(50) DEFAULT 'Success',
  `course` VARCHAR(255) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) UNIQUE NOT NULL,
  `setting_value` TEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
