"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const enums_1 = require("./enums");
class Task {
    props;
    constructor(props) {
        this.props = {
            id: props.id || '',
            projectId: props.projectId,
            moduleId: props.moduleId,
            epicId: props.epicId,
            parentTaskId: props.parentTaskId || null,
            title: props.title,
            description: props.description,
            status: props.status || enums_1.TaskStatus.BACKLOG,
            complexity: props.complexity || 1,
            assigneeId: props.assigneeId,
            reporterId: props.reporterId,
            estimatedHours: props.estimatedHours || 0,
            actualHours: props.actualHours || 0.0,
            startDate: props.startDate || null,
            dueDate: props.dueDate || null,
            completedAt: props.completedAt || null,
            blockedReason: props.blockedReason || null,
            isUrgent: props.isUrgent || false,
            urgentBlockedById: props.urgentBlockedById || null,
            urgentPreviousStatus: props.urgentPreviousStatus || null,
            order: props.order || 0,
            createdAt: props.createdAt || new Date(),
            updatedAt: props.updatedAt || new Date(),
        };
        this.validate();
    }
    validate() {
        if (!this.props.title || this.props.title.trim().length === 0) {
            throw new Error('A tarefa precisa de um título válido.');
        }
        if (this.props.estimatedHours < 0) {
            throw new Error('As horas estimadas não podem ser negativas.');
        }
    }
    get id() { return this.props.id; }
    get projectId() { return this.props.projectId; }
    get moduleId() { return this.props.moduleId; }
    get epicId() { return this.props.epicId; }
    get parentTaskId() { return this.props.parentTaskId; }
    get title() { return this.props.title; }
    get description() { return this.props.description; }
    get status() { return this.props.status; }
    get complexity() { return this.props.complexity; }
    get assigneeId() { return this.props.assigneeId; }
    get reporterId() { return this.props.reporterId; }
    get estimatedHours() { return this.props.estimatedHours; }
    get actualHours() { return this.props.actualHours; }
    get startDate() { return this.props.startDate; }
    get dueDate() { return this.props.dueDate; }
    get completedAt() { return this.props.completedAt; }
    get blockedReason() { return this.props.blockedReason; }
    get isUrgent() { return this.props.isUrgent; }
    get urgentBlockedById() { return this.props.urgentBlockedById; }
    get urgentPreviousStatus() { return this.props.urgentPreviousStatus; }
    get order() { return this.props.order; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }
    blockDueToUrgency(urgentTaskId) {
        if (this.props.status === enums_1.TaskStatus.CONCLUIDA || this.props.status === enums_1.TaskStatus.CANCELADA) {
            return;
        }
        this.props.urgentPreviousStatus = this.props.status;
        this.props.status = enums_1.TaskStatus.BLOQUEADA;
        this.props.urgentBlockedById = urgentTaskId;
        this.props.blockedReason = `Bloqueado automaticamente devido à tarefa urgente ID: ${urgentTaskId}`;
        this.props.updatedAt = new Date();
    }
    releaseUrgencyBlock() {
        if (this.props.status === enums_1.TaskStatus.BLOQUEADA && this.props.urgentBlockedById) {
            this.props.status = this.props.urgentPreviousStatus || enums_1.TaskStatus.BACKLOG;
            this.props.urgentBlockedById = null;
            this.props.urgentPreviousStatus = null;
            this.props.blockedReason = null;
            this.props.updatedAt = new Date();
        }
    }
    addHours(hours) {
        if (hours <= 0)
            throw new Error('Não é possível adicionar quantidade de horas negativa ou zero.');
        this.props.actualHours = Number((this.props.actualHours + hours).toFixed(2));
        this.props.updatedAt = new Date();
    }
    updateStatus(status) {
        this.props.status = status;
        if (status === enums_1.TaskStatus.CONCLUIDA) {
            this.props.completedAt = new Date();
        }
        else {
            this.props.completedAt = null;
        }
        this.props.updatedAt = new Date();
    }
}
exports.Task = Task;
//# sourceMappingURL=task.entity.js.map