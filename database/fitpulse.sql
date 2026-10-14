CREATE SCHEMA IF NOT EXISTS `fitpulse` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `fitpulse`;

CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_email` (`email`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `instructor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `specialty` VARCHAR(45) NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `class` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `schedule` DATETIME NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `description` VARCHAR(500) NULL,
  `category` VARCHAR(45) NOT NULL,
  `maximum_limit` INT NOT NULL,
  `instructor_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_class_instructor` (`instructor_id`),
  KEY `idx_class_schedule` (`schedule`),
  CONSTRAINT `fk_class_instructor` FOREIGN KEY (`instructor_id`)
    REFERENCES `instructor` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_class_price` CHECK (`price` >= 0),
  CONSTRAINT `chk_class_maximum_limit` CHECK (`maximum_limit` > 0)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `review` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rating` TINYINT UNSIGNED NOT NULL,
  `tags` VARCHAR(100) NULL,
  `comment` VARCHAR(500) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `class_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_review_user_class` (`user_id`, `class_id`),
  KEY `idx_review_class` (`class_id`),
  CONSTRAINT `fk_review_class` FOREIGN KEY (`class_id`)
    REFERENCES `class` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`)
    REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_review_rating` CHECK (`rating` BETWEEN 1 AND 5)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `purchase` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `package_name` VARCHAR(100) NOT NULL,
  `amount_paid` DECIMAL(10,2) NOT NULL,
  `purchased_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_purchase_user` (`user_id`),
  KEY `idx_purchase_date` (`purchased_at`),
  CONSTRAINT `fk_purchase_user` FOREIGN KEY (`user_id`)
    REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_purchase_amount` CHECK (`amount_paid` > 0)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `personal_best` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `exercise` VARCHAR(45) NOT NULL,
  `value` DECIMAL(10,2) NOT NULL,
  `unit` VARCHAR(10) NOT NULL,
  `recorded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_personal_best_user` (`user_id`),
  CONSTRAINT `fk_personal_best_user` FOREIGN KEY (`user_id`)
    REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_personal_best_value` CHECK (`value` > 0)
) ENGINE = InnoDB;
