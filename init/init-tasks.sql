-- init-tasks.sql 
-- This script runs automatically when MySQL container starts for the first time

CREATE DATABASE IF NOT EXISTS `task`;
USE `task`;

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` ENUM('todo','done') NOT NULL DEFAULT 'todo',
  `priority` ENUM('low','medium','high') NOT NULL DEFAULT 'low',
  `dueDate` DATETIME NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert some example data
INSERT INTO `tasks` (`id`,`title`,`description`,`priority`,`dueDate`,`createdAt`,`status`) VALUES
('2','Write API','Document all endpoints and usage examples','medium','2025-10-14','2025-10-06 09:30:00','done'),
('3','Fix login bug','Resolve token issue after page reload','high','2025-10-07','2025-10-02 13:15:00','done'),
('4','Add dark mode','Implement theme toggle for dark mode','low','2025-10-20','2025-10-07 11:00:00','done')
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),
  `description`=VALUES(`description`),
  `priority`=VALUES(`priority`),
  `dueDate`=VALUES(`dueDate`),
  `status`=VALUES(`status`),
  `updatedAt`=CURRENT_TIMESTAMP;