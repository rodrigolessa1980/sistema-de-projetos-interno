-- AlterTable: altera coluna avatar de VARCHAR(255) para TEXT para suportar imagens base64
ALTER TABLE `projects` MODIFY COLUMN `avatar` TEXT NULL;
