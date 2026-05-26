"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderKanbanTasksUseCase = void 0;
const common_1 = require("@nestjs/common");
const not_found_exception_1 = require("../../domain/exceptions/not-found.exception");
const task_repository_interface_1 = require("../../domain/repositories/task-repository.interface");
let ReorderKanbanTasksUseCase = class ReorderKanbanTasksUseCase {
    taskRepository;
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async execute(input) {
        const task = await this.taskRepository.findById(input.taskId);
        if (!task) {
            throw new not_found_exception_1.NotFoundException('Tarefa', input.taskId);
        }
        const targetIds = new Set(input.targetTaskIds);
        if (!targetIds.has(input.taskId)) {
            throw new common_1.BadRequestException('A tarefa movida precisa estar na lista de destino.');
        }
        if (targetIds.size !== input.targetTaskIds.length) {
            throw new common_1.BadRequestException('A lista de destino contém tarefas duplicadas.');
        }
        if (input.sourceTaskIds && new Set(input.sourceTaskIds).size !== input.sourceTaskIds.length) {
            throw new common_1.BadRequestException('A lista de origem contém tarefas duplicadas.');
        }
        await this.taskRepository.updateKanbanOrder(input);
    }
};
exports.ReorderKanbanTasksUseCase = ReorderKanbanTasksUseCase;
exports.ReorderKanbanTasksUseCase = ReorderKanbanTasksUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(task_repository_interface_1.ITaskRepositoryToken)),
    __metadata("design:paramtypes", [Object])
], ReorderKanbanTasksUseCase);
//# sourceMappingURL=reorder-kanban-tasks.use-case.js.map