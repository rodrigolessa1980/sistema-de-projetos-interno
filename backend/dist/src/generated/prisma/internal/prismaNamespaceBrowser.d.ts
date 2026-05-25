import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Company: "Company";
    readonly User: "User";
    readonly Project: "Project";
    readonly ProjectDeveloper: "ProjectDeveloper";
    readonly Module: "Module";
    readonly Epic: "Epic";
    readonly Task: "Task";
    readonly Subtask: "Subtask";
    readonly TaskDependency: "TaskDependency";
    readonly TimeLog: "TimeLog";
    readonly Comment: "Comment";
    readonly Notification: "Notification";
    readonly AuditLog: "AuditLog";
    readonly StatusHistory: "StatusHistory";
    readonly TaskNote: "TaskNote";
    readonly TaskAttachment: "TaskAttachment";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const CompanyScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly shortName: "shortName";
    readonly color: "color";
    readonly cnpj: "cnpj";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly role: "role";
    readonly avatar: "avatar";
    readonly position: "position";
    readonly department: "department";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const ProjectScalarFieldEnum: {
    readonly id: "id";
    readonly companyId: "companyId";
    readonly name: "name";
    readonly description: "description";
    readonly status: "status";
    readonly ownerId: "ownerId";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly estimatedHours: "estimatedHours";
    readonly actualHours: "actualHours";
    readonly progress: "progress";
    readonly color: "color";
    readonly avatar: "avatar";
    readonly testUrl: "testUrl";
    readonly queueOrder: "queueOrder";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum];
export declare const ProjectDeveloperScalarFieldEnum: {
    readonly projectId: "projectId";
    readonly userId: "userId";
};
export type ProjectDeveloperScalarFieldEnum = (typeof ProjectDeveloperScalarFieldEnum)[keyof typeof ProjectDeveloperScalarFieldEnum];
export declare const ModuleScalarFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly name: "name";
    readonly description: "description";
    readonly order: "order";
    readonly progress: "progress";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ModuleScalarFieldEnum = (typeof ModuleScalarFieldEnum)[keyof typeof ModuleScalarFieldEnum];
export declare const EpicScalarFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly moduleId: "moduleId";
    readonly name: "name";
    readonly description: "description";
    readonly status: "status";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly progress: "progress";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EpicScalarFieldEnum = (typeof EpicScalarFieldEnum)[keyof typeof EpicScalarFieldEnum];
export declare const TaskScalarFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly moduleId: "moduleId";
    readonly epicId: "epicId";
    readonly parentTaskId: "parentTaskId";
    readonly title: "title";
    readonly description: "description";
    readonly status: "status";
    readonly complexity: "complexity";
    readonly assigneeId: "assigneeId";
    readonly reporterId: "reporterId";
    readonly estimatedHours: "estimatedHours";
    readonly actualHours: "actualHours";
    readonly startDate: "startDate";
    readonly dueDate: "dueDate";
    readonly completedAt: "completedAt";
    readonly blockedReason: "blockedReason";
    readonly isUrgent: "isUrgent";
    readonly urgentBlockedById: "urgentBlockedById";
    readonly urgentPreviousStatus: "urgentPreviousStatus";
    readonly order: "order";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum];
export declare const SubtaskScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly title: "title";
    readonly completed: "completed";
    readonly assigneeId: "assigneeId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SubtaskScalarFieldEnum = (typeof SubtaskScalarFieldEnum)[keyof typeof SubtaskScalarFieldEnum];
export declare const TaskDependencyScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly dependsOnTaskId: "dependsOnTaskId";
    readonly type: "type";
    readonly createdAt: "createdAt";
};
export type TaskDependencyScalarFieldEnum = (typeof TaskDependencyScalarFieldEnum)[keyof typeof TaskDependencyScalarFieldEnum];
export declare const TimeLogScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly hours: "hours";
    readonly description: "description";
    readonly date: "date";
    readonly status: "status";
    readonly createdAt: "createdAt";
};
export type TimeLogScalarFieldEnum = (typeof TimeLogScalarFieldEnum)[keyof typeof TimeLogScalarFieldEnum];
export declare const CommentScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly content: "content";
    readonly mentions: "mentions";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly type: "type";
    readonly title: "title";
    readonly message: "message";
    readonly read: "read";
    readonly relatedTaskId: "relatedTaskId";
    readonly relatedProjectId: "relatedProjectId";
    readonly createdAt: "createdAt";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly entityType: "entityType";
    readonly entityId: "entityId";
    readonly action: "action";
    readonly userId: "userId";
    readonly previousValue: "previousValue";
    readonly newValue: "newValue";
    readonly description: "description";
    readonly createdAt: "createdAt";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const StatusHistoryScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly fromStatus: "fromStatus";
    readonly toStatus: "toStatus";
    readonly userId: "userId";
    readonly duration: "duration";
    readonly createdAt: "createdAt";
};
export type StatusHistoryScalarFieldEnum = (typeof StatusHistoryScalarFieldEnum)[keyof typeof StatusHistoryScalarFieldEnum];
export declare const TaskNoteScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly content: "content";
    readonly isPinned: "isPinned";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TaskNoteScalarFieldEnum = (typeof TaskNoteScalarFieldEnum)[keyof typeof TaskNoteScalarFieldEnum];
export declare const TaskAttachmentScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly name: "name";
    readonly type: "type";
    readonly size: "size";
    readonly dataUrl: "dataUrl";
    readonly createdAt: "createdAt";
};
export type TaskAttachmentScalarFieldEnum = (typeof TaskAttachmentScalarFieldEnum)[keyof typeof TaskAttachmentScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const CompanyOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly shortName: "shortName";
    readonly color: "color";
    readonly cnpj: "cnpj";
};
export type CompanyOrderByRelevanceFieldEnum = (typeof CompanyOrderByRelevanceFieldEnum)[keyof typeof CompanyOrderByRelevanceFieldEnum];
export declare const UserOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly avatar: "avatar";
    readonly position: "position";
    readonly department: "department";
};
export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum];
export declare const ProjectOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly companyId: "companyId";
    readonly name: "name";
    readonly description: "description";
    readonly ownerId: "ownerId";
    readonly color: "color";
    readonly avatar: "avatar";
    readonly testUrl: "testUrl";
};
export type ProjectOrderByRelevanceFieldEnum = (typeof ProjectOrderByRelevanceFieldEnum)[keyof typeof ProjectOrderByRelevanceFieldEnum];
export declare const ProjectDeveloperOrderByRelevanceFieldEnum: {
    readonly projectId: "projectId";
    readonly userId: "userId";
};
export type ProjectDeveloperOrderByRelevanceFieldEnum = (typeof ProjectDeveloperOrderByRelevanceFieldEnum)[keyof typeof ProjectDeveloperOrderByRelevanceFieldEnum];
export declare const ModuleOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly name: "name";
    readonly description: "description";
};
export type ModuleOrderByRelevanceFieldEnum = (typeof ModuleOrderByRelevanceFieldEnum)[keyof typeof ModuleOrderByRelevanceFieldEnum];
export declare const EpicOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly moduleId: "moduleId";
    readonly name: "name";
    readonly description: "description";
};
export type EpicOrderByRelevanceFieldEnum = (typeof EpicOrderByRelevanceFieldEnum)[keyof typeof EpicOrderByRelevanceFieldEnum];
export declare const TaskOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly moduleId: "moduleId";
    readonly epicId: "epicId";
    readonly parentTaskId: "parentTaskId";
    readonly title: "title";
    readonly description: "description";
    readonly assigneeId: "assigneeId";
    readonly reporterId: "reporterId";
    readonly blockedReason: "blockedReason";
    readonly urgentBlockedById: "urgentBlockedById";
};
export type TaskOrderByRelevanceFieldEnum = (typeof TaskOrderByRelevanceFieldEnum)[keyof typeof TaskOrderByRelevanceFieldEnum];
export declare const SubtaskOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly title: "title";
    readonly assigneeId: "assigneeId";
};
export type SubtaskOrderByRelevanceFieldEnum = (typeof SubtaskOrderByRelevanceFieldEnum)[keyof typeof SubtaskOrderByRelevanceFieldEnum];
export declare const TaskDependencyOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly dependsOnTaskId: "dependsOnTaskId";
};
export type TaskDependencyOrderByRelevanceFieldEnum = (typeof TaskDependencyOrderByRelevanceFieldEnum)[keyof typeof TaskDependencyOrderByRelevanceFieldEnum];
export declare const TimeLogOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly description: "description";
};
export type TimeLogOrderByRelevanceFieldEnum = (typeof TimeLogOrderByRelevanceFieldEnum)[keyof typeof TimeLogOrderByRelevanceFieldEnum];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const CommentOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly content: "content";
};
export type CommentOrderByRelevanceFieldEnum = (typeof CommentOrderByRelevanceFieldEnum)[keyof typeof CommentOrderByRelevanceFieldEnum];
export declare const NotificationOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly title: "title";
    readonly message: "message";
    readonly relatedTaskId: "relatedTaskId";
    readonly relatedProjectId: "relatedProjectId";
};
export type NotificationOrderByRelevanceFieldEnum = (typeof NotificationOrderByRelevanceFieldEnum)[keyof typeof NotificationOrderByRelevanceFieldEnum];
export declare const AuditLogOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly entityId: "entityId";
    readonly userId: "userId";
    readonly description: "description";
};
export type AuditLogOrderByRelevanceFieldEnum = (typeof AuditLogOrderByRelevanceFieldEnum)[keyof typeof AuditLogOrderByRelevanceFieldEnum];
export declare const StatusHistoryOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
};
export type StatusHistoryOrderByRelevanceFieldEnum = (typeof StatusHistoryOrderByRelevanceFieldEnum)[keyof typeof StatusHistoryOrderByRelevanceFieldEnum];
export declare const TaskNoteOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly content: "content";
};
export type TaskNoteOrderByRelevanceFieldEnum = (typeof TaskNoteOrderByRelevanceFieldEnum)[keyof typeof TaskNoteOrderByRelevanceFieldEnum];
export declare const TaskAttachmentOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly name: "name";
    readonly type: "type";
    readonly dataUrl: "dataUrl";
};
export type TaskAttachmentOrderByRelevanceFieldEnum = (typeof TaskAttachmentOrderByRelevanceFieldEnum)[keyof typeof TaskAttachmentOrderByRelevanceFieldEnum];
