-- Autor/dono do módulo: base da regra "admin ou dono pode editar/excluir".
-- Nullable + ON DELETE SET NULL (mesmo padrão de loggedByUserId). Módulos antigos
-- ficam com createdById NULL (sem dono) — nesse caso só admin edita/exclui.

ALTER TABLE `modules` ADD COLUMN `createdById` VARCHAR(191) NULL;

CREATE INDEX `modules_createdById_idx` ON `modules`(`createdById`);

ALTER TABLE `modules` ADD CONSTRAINT `modules_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
