-- CreateTable
CREATE TABLE `epic_developers` (
    `epicId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `epic_developers_userId_idx`(`userId`),
    PRIMARY KEY (`epicId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `epic_developers` ADD CONSTRAINT `epic_developers_epicId_fkey` FOREIGN KEY (`epicId`) REFERENCES `epics`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `epic_developers` ADD CONSTRAINT `epic_developers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
