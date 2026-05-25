"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAttachmentOrderByRelevanceFieldEnum = exports.TaskNoteOrderByRelevanceFieldEnum = exports.StatusHistoryOrderByRelevanceFieldEnum = exports.AuditLogOrderByRelevanceFieldEnum = exports.NotificationOrderByRelevanceFieldEnum = exports.CommentOrderByRelevanceFieldEnum = exports.QueryMode = exports.JsonNullValueFilter = exports.TimeLogOrderByRelevanceFieldEnum = exports.TaskDependencyOrderByRelevanceFieldEnum = exports.SubtaskOrderByRelevanceFieldEnum = exports.TaskOrderByRelevanceFieldEnum = exports.EpicOrderByRelevanceFieldEnum = exports.ModuleOrderByRelevanceFieldEnum = exports.ProjectDeveloperOrderByRelevanceFieldEnum = exports.ProjectOrderByRelevanceFieldEnum = exports.UserOrderByRelevanceFieldEnum = exports.CompanyOrderByRelevanceFieldEnum = exports.NullsOrder = exports.NullableJsonNullValueInput = exports.JsonNullValueInput = exports.SortOrder = exports.TaskAttachmentScalarFieldEnum = exports.TaskNoteScalarFieldEnum = exports.StatusHistoryScalarFieldEnum = exports.AuditLogScalarFieldEnum = exports.NotificationScalarFieldEnum = exports.CommentScalarFieldEnum = exports.TimeLogScalarFieldEnum = exports.TaskDependencyScalarFieldEnum = exports.SubtaskScalarFieldEnum = exports.TaskScalarFieldEnum = exports.EpicScalarFieldEnum = exports.ModuleScalarFieldEnum = exports.ProjectDeveloperScalarFieldEnum = exports.ProjectScalarFieldEnum = exports.UserScalarFieldEnum = exports.CompanyScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = __importStar(require("@prisma/client/runtime/index-browser"));
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Company: 'Company',
    User: 'User',
    Project: 'Project',
    ProjectDeveloper: 'ProjectDeveloper',
    Module: 'Module',
    Epic: 'Epic',
    Task: 'Task',
    Subtask: 'Subtask',
    TaskDependency: 'TaskDependency',
    TimeLog: 'TimeLog',
    Comment: 'Comment',
    Notification: 'Notification',
    AuditLog: 'AuditLog',
    StatusHistory: 'StatusHistory',
    TaskNote: 'TaskNote',
    TaskAttachment: 'TaskAttachment'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.CompanyScalarFieldEnum = {
    id: 'id',
    name: 'name',
    shortName: 'shortName',
    color: 'color',
    cnpj: 'cnpj',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.UserScalarFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    avatar: 'avatar',
    position: 'position',
    department: 'department',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ProjectScalarFieldEnum = {
    id: 'id',
    companyId: 'companyId',
    name: 'name',
    description: 'description',
    status: 'status',
    ownerId: 'ownerId',
    startDate: 'startDate',
    endDate: 'endDate',
    estimatedHours: 'estimatedHours',
    actualHours: 'actualHours',
    progress: 'progress',
    color: 'color',
    avatar: 'avatar',
    testUrl: 'testUrl',
    queueOrder: 'queueOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ProjectDeveloperScalarFieldEnum = {
    projectId: 'projectId',
    userId: 'userId'
};
exports.ModuleScalarFieldEnum = {
    id: 'id',
    projectId: 'projectId',
    name: 'name',
    description: 'description',
    order: 'order',
    progress: 'progress',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.EpicScalarFieldEnum = {
    id: 'id',
    projectId: 'projectId',
    moduleId: 'moduleId',
    name: 'name',
    description: 'description',
    status: 'status',
    startDate: 'startDate',
    endDate: 'endDate',
    progress: 'progress',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.TaskScalarFieldEnum = {
    id: 'id',
    projectId: 'projectId',
    moduleId: 'moduleId',
    epicId: 'epicId',
    parentTaskId: 'parentTaskId',
    title: 'title',
    description: 'description',
    status: 'status',
    complexity: 'complexity',
    assigneeId: 'assigneeId',
    reporterId: 'reporterId',
    estimatedHours: 'estimatedHours',
    actualHours: 'actualHours',
    startDate: 'startDate',
    dueDate: 'dueDate',
    completedAt: 'completedAt',
    blockedReason: 'blockedReason',
    isUrgent: 'isUrgent',
    urgentBlockedById: 'urgentBlockedById',
    urgentPreviousStatus: 'urgentPreviousStatus',
    order: 'order',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SubtaskScalarFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    title: 'title',
    completed: 'completed',
    assigneeId: 'assigneeId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.TaskDependencyScalarFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    dependsOnTaskId: 'dependsOnTaskId',
    type: 'type',
    createdAt: 'createdAt'
};
exports.TimeLogScalarFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId',
    hours: 'hours',
    description: 'description',
    date: 'date',
    status: 'status',
    createdAt: 'createdAt'
};
exports.CommentScalarFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId',
    content: 'content',
    mentions: 'mentions',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.NotificationScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    type: 'type',
    title: 'title',
    message: 'message',
    read: 'read',
    relatedTaskId: 'relatedTaskId',
    relatedProjectId: 'relatedProjectId',
    createdAt: 'createdAt'
};
exports.AuditLogScalarFieldEnum = {
    id: 'id',
    entityType: 'entityType',
    entityId: 'entityId',
    action: 'action',
    userId: 'userId',
    previousValue: 'previousValue',
    newValue: 'newValue',
    description: 'description',
    createdAt: 'createdAt'
};
exports.StatusHistoryScalarFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    fromStatus: 'fromStatus',
    toStatus: 'toStatus',
    userId: 'userId',
    duration: 'duration',
    createdAt: 'createdAt'
};
exports.TaskNoteScalarFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId',
    content: 'content',
    isPinned: 'isPinned',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.TaskAttachmentScalarFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId',
    name: 'name',
    type: 'type',
    size: 'size',
    dataUrl: 'dataUrl',
    createdAt: 'createdAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.CompanyOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    shortName: 'shortName',
    color: 'color',
    cnpj: 'cnpj'
};
exports.UserOrderByRelevanceFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    avatar: 'avatar',
    position: 'position',
    department: 'department'
};
exports.ProjectOrderByRelevanceFieldEnum = {
    id: 'id',
    companyId: 'companyId',
    name: 'name',
    description: 'description',
    ownerId: 'ownerId',
    color: 'color',
    avatar: 'avatar',
    testUrl: 'testUrl'
};
exports.ProjectDeveloperOrderByRelevanceFieldEnum = {
    projectId: 'projectId',
    userId: 'userId'
};
exports.ModuleOrderByRelevanceFieldEnum = {
    id: 'id',
    projectId: 'projectId',
    name: 'name',
    description: 'description'
};
exports.EpicOrderByRelevanceFieldEnum = {
    id: 'id',
    projectId: 'projectId',
    moduleId: 'moduleId',
    name: 'name',
    description: 'description'
};
exports.TaskOrderByRelevanceFieldEnum = {
    id: 'id',
    projectId: 'projectId',
    moduleId: 'moduleId',
    epicId: 'epicId',
    parentTaskId: 'parentTaskId',
    title: 'title',
    description: 'description',
    assigneeId: 'assigneeId',
    reporterId: 'reporterId',
    blockedReason: 'blockedReason',
    urgentBlockedById: 'urgentBlockedById'
};
exports.SubtaskOrderByRelevanceFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    title: 'title',
    assigneeId: 'assigneeId'
};
exports.TaskDependencyOrderByRelevanceFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    dependsOnTaskId: 'dependsOnTaskId'
};
exports.TimeLogOrderByRelevanceFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId',
    description: 'description'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.CommentOrderByRelevanceFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId',
    content: 'content'
};
exports.NotificationOrderByRelevanceFieldEnum = {
    id: 'id',
    userId: 'userId',
    title: 'title',
    message: 'message',
    relatedTaskId: 'relatedTaskId',
    relatedProjectId: 'relatedProjectId'
};
exports.AuditLogOrderByRelevanceFieldEnum = {
    id: 'id',
    entityId: 'entityId',
    userId: 'userId',
    description: 'description'
};
exports.StatusHistoryOrderByRelevanceFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId'
};
exports.TaskNoteOrderByRelevanceFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId',
    content: 'content'
};
exports.TaskAttachmentOrderByRelevanceFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId',
    name: 'name',
    type: 'type',
    dataUrl: 'dataUrl'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map