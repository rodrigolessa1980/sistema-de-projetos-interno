export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly DEVELOPER: "DEVELOPER";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const ProjectStatus: {
    readonly ATIVO: "ATIVO";
    readonly PAUSADO: "PAUSADO";
    readonly CONCLUIDO: "CONCLUIDO";
    readonly CANCELADO: "CANCELADO";
    readonly NA_FILA: "NA_FILA";
};
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];
export declare const TaskStatus: {
    readonly BACKLOG: "BACKLOG";
    readonly PLANEJADA: "PLANEJADA";
    readonly BLOQUEADA: "BLOQUEADA";
    readonly EM_DESENVOLVIMENTO: "EM_DESENVOLVIMENTO";
    readonly EM_REVISAO: "EM_REVISAO";
    readonly HOMOLOGACAO: "HOMOLOGACAO";
    readonly CONCLUIDA: "CONCLUIDA";
    readonly CANCELADA: "CANCELADA";
};
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export declare const DependencyType: {
    readonly BLOCKS: "BLOCKS";
    readonly BLOCKED_BY: "BLOCKED_BY";
    readonly RELATED: "RELATED";
};
export type DependencyType = (typeof DependencyType)[keyof typeof DependencyType];
export declare const AuditEntityType: {
    readonly TASK: "TASK";
    readonly PROJECT: "PROJECT";
    readonly MODULE: "MODULE";
    readonly EPIC: "EPIC";
    readonly USER: "USER";
};
export type AuditEntityType = (typeof AuditEntityType)[keyof typeof AuditEntityType];
export declare const AuditAction: {
    readonly CREATED: "CREATED";
    readonly UPDATED: "UPDATED";
    readonly DELETED: "DELETED";
    readonly STATUS_CHANGED: "STATUS_CHANGED";
    readonly ASSIGNED: "ASSIGNED";
    readonly COMMENTED: "COMMENTED";
    readonly TIME_LOGGED: "TIME_LOGGED";
};
export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];
export declare const NotificationType: {
    readonly TASK_ASSIGNED: "TASK_ASSIGNED";
    readonly TASK_UPDATED: "TASK_UPDATED";
    readonly TASK_BLOCKED: "TASK_BLOCKED";
    readonly TASK_COMPLETED: "TASK_COMPLETED";
    readonly TASK_OVERDUE: "TASK_OVERDUE";
    readonly COMMENT_ADDED: "COMMENT_ADDED";
    readonly DEPENDENCY_RESOLVED: "DEPENDENCY_RESOLVED";
    readonly PROJECT_UPDATED: "PROJECT_UPDATED";
};
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
