"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const enums_1 = require("./enums");
class Project {
    props;
    constructor(props) {
        this.props = {
            id: props.id || '',
            companyId: props.companyId,
            name: props.name,
            description: props.description,
            status: props.status || enums_1.ProjectStatus.NA_FILA,
            ownerId: props.ownerId,
            startDate: props.startDate,
            endDate: props.endDate || null,
            estimatedHours: props.estimatedHours || 0,
            actualHours: props.actualHours || 0.0,
            progress: props.progress || 0,
            color: props.color || '#6366f1',
            avatar: props.avatar || null,
            testUrl: props.testUrl || null,
            queueOrder: props.queueOrder === undefined ? null : props.queueOrder,
            createdAt: props.createdAt || new Date(),
            updatedAt: props.updatedAt || new Date(),
        };
        this.validate();
    }
    validate() {
        if (!this.props.name || this.props.name.trim().length === 0) {
            throw new Error('Nome do projeto é obrigatório.');
        }
        if (this.props.estimatedHours < 0) {
            throw new Error('As horas estimadas não podem ser negativas.');
        }
        if (this.props.progress < 0 || this.props.progress > 100) {
            throw new Error('O progresso do projeto deve estar entre 0 e 100.');
        }
    }
    get id() { return this.props.id; }
    get companyId() { return this.props.companyId; }
    get name() { return this.props.name; }
    get description() { return this.props.description; }
    get status() { return this.props.status; }
    get ownerId() { return this.props.ownerId; }
    get startDate() { return this.props.startDate; }
    get endDate() { return this.props.endDate; }
    get estimatedHours() { return this.props.estimatedHours; }
    get actualHours() { return this.props.actualHours; }
    get progress() { return this.props.progress; }
    get color() { return this.props.color; }
    get avatar() { return this.props.avatar; }
    get testUrl() { return this.props.testUrl; }
    get queueOrder() { return this.props.queueOrder; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }
    updateProgress(progress) {
        if (progress < 0 || progress > 100) {
            throw new Error('O progresso deve estar entre 0 e 100.');
        }
        this.props.progress = progress;
        this.props.updatedAt = new Date();
    }
    setQueueOrder(order) {
        this.props.queueOrder = order;
        this.props.updatedAt = new Date();
    }
    updateHours(actualHours) {
        this.props.actualHours = Number(actualHours.toFixed(2));
        this.props.updatedAt = new Date();
    }
}
exports.Project = Project;
//# sourceMappingURL=project.entity.js.map