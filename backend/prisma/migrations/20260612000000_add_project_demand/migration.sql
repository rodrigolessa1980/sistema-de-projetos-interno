ALTER TABLE `projects` ADD COLUMN `demandDescription` TEXT NULL;

CREATE TABLE `project_demand_attachments` (
  `id` VARCHAR(191) NOT NULL,
  `projectId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `size` INTEGER NOT NULL,
  `dataUrl` LONGTEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  INDEX `project_demand_attachments_projectId_idx`(`projectId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `project_demand_attachments` ADD CONSTRAINT `project_demand_attachments_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `project_demand_attachments` ADD CONSTRAINT `project_demand_attachments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
