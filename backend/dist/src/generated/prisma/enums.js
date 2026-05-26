"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogSource = exports.NotificationType = exports.AuditAction = exports.AuditEntityType = exports.DependencyType = exports.TaskStatus = exports.ProjectStatus = exports.UserRole = void 0;
exports.UserRole = {
    ADMIN: 'ADMIN',
    DEVELOPER: 'DEVELOPER'
};
exports.ProjectStatus = {
    ATIVO: 'ATIVO',
    PAUSADO: 'PAUSADO',
    CONCLUIDO: 'CONCLUIDO',
    CANCELADO: 'CANCELADO',
    NA_FILA: 'NA_FILA'
};
exports.TaskStatus = {
    BACKLOG: 'BACKLOG',
    PLANEJADA: 'PLANEJADA',
    BLOQUEADA: 'BLOQUEADA',
    EM_DESENVOLVIMENTO: 'EM_DESENVOLVIMENTO',
    EM_REVISAO: 'EM_REVISAO',
    HOMOLOGACAO: 'HOMOLOGACAO',
    CONCLUIDA: 'CONCLUIDA',
    CANCELADA: 'CANCELADA'
};
exports.DependencyType = {
    BLOCKS: 'BLOCKS',
    BLOCKED_BY: 'BLOCKED_BY',
    RELATED: 'RELATED'
};
exports.AuditEntityType = {
    TASK: 'TASK',
    PROJECT: 'PROJECT',
    MODULE: 'MODULE',
    EPIC: 'EPIC',
    USER: 'USER'
};
exports.AuditAction = {
    CREATED: 'CREATED',
    UPDATED: 'UPDATED',
    DELETED: 'DELETED',
    STATUS_CHANGED: 'STATUS_CHANGED',
    ASSIGNED: 'ASSIGNED',
    COMMENTED: 'COMMENTED',
    TIME_LOGGED: 'TIME_LOGGED'
};
exports.NotificationType = {
    TASK_ASSIGNED: 'TASK_ASSIGNED',
    TASK_UPDATED: 'TASK_UPDATED',
    TASK_BLOCKED: 'TASK_BLOCKED',
    TASK_COMPLETED: 'TASK_COMPLETED',
    TASK_OVERDUE: 'TASK_OVERDUE',
    COMMENT_ADDED: 'COMMENT_ADDED',
    DEPENDENCY_RESOLVED: 'DEPENDENCY_RESOLVED',
    PROJECT_UPDATED: 'PROJECT_UPDATED'
};
exports.TimeLogSource = {
    TIMER: 'TIMER',
    MANUAL: 'MANUAL'
};
//# sourceMappingURL=enums.js.map