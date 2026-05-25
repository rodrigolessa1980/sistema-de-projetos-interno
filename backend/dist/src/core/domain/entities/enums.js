"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyType = exports.TaskStatus = exports.ProjectStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["DEVELOPER"] = "DEVELOPER";
})(UserRole || (exports.UserRole = UserRole = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["ATIVO"] = "ATIVO";
    ProjectStatus["PAUSADO"] = "PAUSADO";
    ProjectStatus["CONCLUIDO"] = "CONCLUIDO";
    ProjectStatus["CANCELADO"] = "CANCELADO";
    ProjectStatus["NA_FILA"] = "NA_FILA";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["BACKLOG"] = "BACKLOG";
    TaskStatus["PLANEJADA"] = "PLANEJADA";
    TaskStatus["BLOQUEADA"] = "BLOQUEADA";
    TaskStatus["EM_DESENVOLVIMENTO"] = "EM_DESENVOLVIMENTO";
    TaskStatus["EM_REVISAO"] = "EM_REVISAO";
    TaskStatus["HOMOLOGACAO"] = "HOMOLOGACAO";
    TaskStatus["CONCLUIDA"] = "CONCLUIDA";
    TaskStatus["CANCELADA"] = "CANCELADA";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var DependencyType;
(function (DependencyType) {
    DependencyType["BLOCKS"] = "BLOCKS";
    DependencyType["BLOCKED_BY"] = "BLOCKED_BY";
    DependencyType["RELATED"] = "RELATED";
})(DependencyType || (exports.DependencyType = DependencyType = {}));
//# sourceMappingURL=enums.js.map