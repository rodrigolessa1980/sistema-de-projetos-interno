-- AlterTable: make companyId nullable on projects
ALTER TABLE `projects` MODIFY `companyId` VARCHAR(191) NULL;
