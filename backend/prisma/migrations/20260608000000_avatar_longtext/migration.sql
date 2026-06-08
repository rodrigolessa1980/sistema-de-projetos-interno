-- AlterTable: avatar de TEXT para LONGTEXT para suportar imagens base64 grandes (>64KB)
ALTER TABLE `projects` MODIFY COLUMN `avatar` LONGTEXT NULL;
