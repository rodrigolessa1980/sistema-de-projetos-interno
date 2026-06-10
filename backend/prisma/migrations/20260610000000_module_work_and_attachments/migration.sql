-- AlterTable
ALTER TABLE `modules` ADD COLUMN `workDate` DATE NULL,
    ADD COLUMN `loggedHours` DOUBLE NULL,
    ADD COLUMN `loggedByUserId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `modules_loggedByUserId_idx` ON `modules`(`loggedByUserId`);

-- AddForeignKey
ALTER TABLE `modules` ADD CONSTRAINT `modules_loggedByUserId_fkey` FOREIGN KEY (`loggedByUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `module_attachments` (
    `id` VARCHAR(191) NOT NULL,
    `moduleId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `size` INTEGER NOT NULL,
    `dataUrl` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `module_attachments_moduleId_idx`(`moduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `module_attachments` ADD CONSTRAINT `module_attachments_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `modules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_attachments` ADD CONSTRAINT `module_attachments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
