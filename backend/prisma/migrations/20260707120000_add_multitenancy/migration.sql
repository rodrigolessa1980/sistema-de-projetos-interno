-- Multi-tenancy: cria a tabela `tenants`, adiciona `tenantId` a todas as tabelas
-- de domínio e faz backfill de TODO o dado existente para o tenant "Desenvolvimento".
--
-- Técnica: ADD COLUMN NOT NULL DEFAULT '<dev-uuid>' backfilla as linhas existentes
-- em um passo; em seguida DROP DEFAULT para o schema final bater com o Prisma
-- (coluna NOT NULL sem default). Novos INSERTs recebem `tenantId` pela extensão.
--
-- UUIDs fixos:
--   Desenvolvimento = 00000000-0000-4000-a000-000000000001
--   Marketing       = 00000000-0000-4000-a000-000000000002

-- CreateTable
CREATE TABLE `tenants` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(50) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tenants_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed dos tenants (idempotente com o seed.ts via UUID fixo)
INSERT INTO `tenants` (`id`, `name`, `slug`, `isActive`, `createdAt`, `updatedAt`) VALUES
    ('00000000-0000-4000-a000-000000000001', 'Desenvolvimento', 'desenvolvimento', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
    ('00000000-0000-4000-a000-000000000002', 'Marketing', 'marketing', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

-- ─────────────────────────────────────────────────────────────────────────────
-- companies (caso especial: cnpj deixa de ser único global -> único por tenant)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `companies` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `companies` ALTER COLUMN `tenantId` DROP DEFAULT;
DROP INDEX `companies_cnpj_key` ON `companies`;
CREATE UNIQUE INDEX `companies_tenantId_cnpj_key` ON `companies`(`tenantId`, `cnpj`);
CREATE INDEX `companies_tenantId_idx` ON `companies`(`tenantId`);
ALTER TABLE `companies` ADD CONSTRAINT `companies_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- users (+ isApproved: aprovação de cadastro. Usuários existentes já aprovados)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `users` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `users` ALTER COLUMN `tenantId` DROP DEFAULT;
ALTER TABLE `users` ADD COLUMN `isApproved` BOOLEAN NOT NULL DEFAULT false;
UPDATE `users` SET `isApproved` = true;
-- E-mail passa a ser único POR GRUPO (mesmo e-mail pode existir em tenants diferentes).
DROP INDEX `users_email_key` ON `users`;
CREATE UNIQUE INDEX `users_tenantId_email_key` ON `users`(`tenantId`, `email`);
CREATE INDEX `users_tenantId_idx` ON `users`(`tenantId`);
ALTER TABLE `users` ADD CONSTRAINT `users_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- api_tokens
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `api_tokens` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `api_tokens` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `api_tokens_tenantId_idx` ON `api_tokens`(`tenantId`);
ALTER TABLE `api_tokens` ADD CONSTRAINT `api_tokens_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- user_permissions
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `user_permissions` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `user_permissions` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `user_permissions_tenantId_idx` ON `user_permissions`(`tenantId`);
ALTER TABLE `user_permissions` ADD CONSTRAINT `user_permissions_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- projects
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `projects` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `projects` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `projects_tenantId_idx` ON `projects`(`tenantId`);
ALTER TABLE `projects` ADD CONSTRAINT `projects_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- project_developers
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `project_developers` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `project_developers` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `project_developers_tenantId_idx` ON `project_developers`(`tenantId`);
ALTER TABLE `project_developers` ADD CONSTRAINT `project_developers_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- modules
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `modules` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `modules` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `modules_tenantId_idx` ON `modules`(`tenantId`);
ALTER TABLE `modules` ADD CONSTRAINT `modules_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- epics
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `epics` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `epics` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `epics_tenantId_idx` ON `epics`(`tenantId`);
ALTER TABLE `epics` ADD CONSTRAINT `epics_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- epic_developers
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `epic_developers` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `epic_developers` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `epic_developers_tenantId_idx` ON `epic_developers`(`tenantId`);
ALTER TABLE `epic_developers` ADD CONSTRAINT `epic_developers_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- tasks
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `tasks` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `tasks` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `tasks_tenantId_idx` ON `tasks`(`tenantId`);
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- subtasks
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `subtasks` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `subtasks` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `subtasks_tenantId_idx` ON `subtasks`(`tenantId`);
ALTER TABLE `subtasks` ADD CONSTRAINT `subtasks_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- task_dependencies
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `task_dependencies` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `task_dependencies` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `task_dependencies_tenantId_idx` ON `task_dependencies`(`tenantId`);
ALTER TABLE `task_dependencies` ADD CONSTRAINT `task_dependencies_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- time_logs
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `time_logs` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `time_logs` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `time_logs_tenantId_idx` ON `time_logs`(`tenantId`);
ALTER TABLE `time_logs` ADD CONSTRAINT `time_logs_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- comments
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `comments` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `comments` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `comments_tenantId_idx` ON `comments`(`tenantId`);
ALTER TABLE `comments` ADD CONSTRAINT `comments_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- notifications
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `notifications` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `notifications` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `notifications_tenantId_idx` ON `notifications`(`tenantId`);
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- audit_logs
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `audit_logs` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `audit_logs` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `audit_logs_tenantId_idx` ON `audit_logs`(`tenantId`);
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- status_histories
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `status_histories` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `status_histories` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `status_histories_tenantId_idx` ON `status_histories`(`tenantId`);
ALTER TABLE `status_histories` ADD CONSTRAINT `status_histories_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- task_notes
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `task_notes` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `task_notes` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `task_notes_tenantId_idx` ON `task_notes`(`tenantId`);
ALTER TABLE `task_notes` ADD CONSTRAINT `task_notes_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- task_attachments
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `task_attachments` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `task_attachments` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `task_attachments_tenantId_idx` ON `task_attachments`(`tenantId`);
ALTER TABLE `task_attachments` ADD CONSTRAINT `task_attachments_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- module_attachments
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `module_attachments` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `module_attachments` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `module_attachments_tenantId_idx` ON `module_attachments`(`tenantId`);
ALTER TABLE `module_attachments` ADD CONSTRAINT `module_attachments_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- project_showcase_attachments
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `project_showcase_attachments` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `project_showcase_attachments` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `project_showcase_attachments_tenantId_idx` ON `project_showcase_attachments`(`tenantId`);
ALTER TABLE `project_showcase_attachments` ADD CONSTRAINT `project_showcase_attachments_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- project_demand_attachments
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE `project_demand_attachments` ADD COLUMN `tenantId` VARCHAR(191) NOT NULL DEFAULT '00000000-0000-4000-a000-000000000001';
ALTER TABLE `project_demand_attachments` ALTER COLUMN `tenantId` DROP DEFAULT;
CREATE INDEX `project_demand_attachments_tenantId_idx` ON `project_demand_attachments`(`tenantId`);
ALTER TABLE `project_demand_attachments` ADD CONSTRAINT `project_demand_attachments_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
