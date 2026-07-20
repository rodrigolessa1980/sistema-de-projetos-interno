-- Soft delete para usuários. Coluna nullable SEM default: linhas existentes
-- recebem NULL (= ativo). A extensão de tenant injeta `deletedAt IS NULL` no
-- where das leituras/escritas de User, então excluir vira soft delete e o
-- usuário some das listas/pickers sem apagar o histórico (tarefas, logs, etc.).
-- O login também passa a filtrar `deletedAt IS NULL` (client base), bloqueando
-- acesso de conta excluída. DDL MySQL não é transacional — ensaiar em cópia.

ALTER TABLE `users` ADD COLUMN `deletedAt` DATETIME(3) NULL;
