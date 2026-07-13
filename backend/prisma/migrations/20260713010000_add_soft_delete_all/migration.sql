-- Soft delete para o restante das entidades de dado: projeto, empresa, time log
-- e os 4 tipos de anexo. Complementa 20260713000000_add_soft_delete (task/module/epic).
--
-- Colunas nullable SEM default: linhas existentes recebem NULL (= ativo). A extensão
-- de tenant injeta `deletedAt IS NULL` no where das leituras/escritas desses modelos,
-- então excluir vira soft delete e nada some retroativamente. Excluir um projeto passa
-- a ocultar (soft) todo o seu conteúdo em vez de apagar o banco em cascata.
-- DDL MySQL não é transacional — ensaiar em cópia antes de aplicar em produção.

ALTER TABLE `projects` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `companies` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `time_logs` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `task_attachments` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `module_attachments` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `project_showcase_attachments` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `project_demand_attachments` ADD COLUMN `deletedAt` DATETIME(3) NULL;
