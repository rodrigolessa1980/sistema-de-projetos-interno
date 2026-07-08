-- INC-11/INC-12: carimbo de modificação no TimeLog + índices para delta sync.
--
-- `updatedAt` é gerenciado pelo Prisma (@updatedAt) e não tem DEFAULT no schema.
-- Para não quebrar linhas existentes (NOT NULL), usa-se a técnica ADD COLUMN com
-- DEFAULT (backfill) seguida de DROP DEFAULT (alinha com o schema, sem drift).
-- DDL MySQL não é transacional — ensaiar em cópia antes de aplicar em produção.

ALTER TABLE `time_logs` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
ALTER TABLE `time_logs` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- Índices para a query de delta (updatedAt > since), escopados por tenant.
CREATE INDEX `time_logs_tenantId_updatedAt_idx` ON `time_logs`(`tenantId`, `updatedAt`);
CREATE INDEX `projects_tenantId_updatedAt_idx` ON `projects`(`tenantId`, `updatedAt`);
CREATE INDEX `tasks_tenantId_updatedAt_idx` ON `tasks`(`tenantId`, `updatedAt`);
CREATE INDEX `modules_tenantId_updatedAt_idx` ON `modules`(`tenantId`, `updatedAt`);
CREATE INDEX `epics_tenantId_updatedAt_idx` ON `epics`(`tenantId`, `updatedAt`);
