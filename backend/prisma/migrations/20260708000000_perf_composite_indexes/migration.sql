-- INC-10: índices compostos liderados por tenantId.
-- Toda query de domínio filtra `tenantId AND <coluna>` (extensão multi-tenant);
-- índices de coluna única não cobrem os dois campos. Estes compostos evitam varredura.
-- Migração aditiva (apenas CREATE INDEX) — sem risco de perda de dados.

CREATE INDEX `tasks_tenantId_projectId_idx` ON `tasks`(`tenantId`, `projectId`);
CREATE INDEX `tasks_tenantId_assigneeId_idx` ON `tasks`(`tenantId`, `assigneeId`);
CREATE INDEX `tasks_tenantId_status_idx` ON `tasks`(`tenantId`, `status`);

CREATE INDEX `time_logs_tenantId_projectId_date_idx` ON `time_logs`(`tenantId`, `projectId`, `date`);
CREATE INDEX `time_logs_tenantId_userId_date_idx` ON `time_logs`(`tenantId`, `userId`, `date`);

CREATE INDEX `modules_tenantId_projectId_idx` ON `modules`(`tenantId`, `projectId`);

CREATE INDEX `epics_tenantId_projectId_idx` ON `epics`(`tenantId`, `projectId`);
