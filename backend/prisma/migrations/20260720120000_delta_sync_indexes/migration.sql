-- Índices compostos (tenantId, updatedAt/createdAt) para o delta sync das
-- coleções de tarefa. As tabelas grandes (tasks/modules/projects/epics/time_logs)
-- já tinham; comments/subtasks/task_notes/task_dependencies não. Sem eles, o
-- `WHERE tenantId = ? AND updatedAt > ?` de cada poll faz scan filtrado; com o
-- composto vira range scan. Barato de criar, escala melhor.

CREATE INDEX `comments_tenantId_updatedAt_idx` ON `comments`(`tenantId`, `updatedAt`);
CREATE INDEX `subtasks_tenantId_updatedAt_idx` ON `subtasks`(`tenantId`, `updatedAt`);
CREATE INDEX `task_notes_tenantId_updatedAt_idx` ON `task_notes`(`tenantId`, `updatedAt`);
CREATE INDEX `task_dependencies_tenantId_createdAt_idx` ON `task_dependencies`(`tenantId`, `createdAt`);
