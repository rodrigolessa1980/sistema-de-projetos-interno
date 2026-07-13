-- Soft delete para tasks, modules e epics.
--
-- Coluna nullable SEM default: linhas existentes recebem NULL (= registro ativo),
-- então nada é ocultado retroativamente. A extensão de tenant injeta
-- `deletedAt IS NULL` no where de toda leitura/escrita por id desses modelos,
-- então registros excluídos somem das listas/kanban/relatórios e, via snapshot de
-- ids do /sync/changes, são podados nos demais clientes.
-- DDL MySQL não é transacional — ensaiar em cópia antes de aplicar em produção.

ALTER TABLE `tasks` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `modules` ADD COLUMN `deletedAt` DATETIME(3) NULL;
ALTER TABLE `epics` ADD COLUMN `deletedAt` DATETIME(3) NULL;
