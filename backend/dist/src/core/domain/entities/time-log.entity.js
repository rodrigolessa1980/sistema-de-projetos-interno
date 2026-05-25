"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLog = void 0;
class TimeLog {
    props;
    constructor(props) {
        this.props = {
            id: props.id || '',
            taskId: props.taskId,
            userId: props.userId,
            hours: props.hours,
            description: props.description,
            date: props.date,
            status: props.status,
            createdAt: props.createdAt || new Date(),
        };
        this.validate();
    }
    validate() {
        if (this.props.hours <= 0) {
            throw new Error('As horas registradas devem ser maiores que zero.');
        }
        if (!this.props.description || this.props.description.trim().length === 0) {
            throw new Error('A descrição do log de tempo é obrigatória.');
        }
    }
    get id() { return this.props.id; }
    get taskId() { return this.props.taskId; }
    get userId() { return this.props.userId; }
    get hours() { return this.props.hours; }
    get description() { return this.props.description; }
    get date() { return this.props.date; }
    get status() { return this.props.status; }
    get createdAt() { return this.props.createdAt; }
}
exports.TimeLog = TimeLog;
//# sourceMappingURL=time-log.entity.js.map