-- Soft delete para comentários. Diferente das outras entidades, comentário
-- apagado NÃO some: continua sendo lido (marcado como "apagado" na thread) e
-- fica no log de auditoria. Por isso Comment NÃO entra em SOFT_DELETE_MODELS
-- (a extensão não filtra automaticamente); o tratamento é explícito no domínio.
ALTER TABLE `comments` ADD COLUMN `deletedAt` DATETIME(3) NULL;
