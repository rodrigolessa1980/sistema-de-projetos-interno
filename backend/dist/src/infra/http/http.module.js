"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpModule = void 0;
const common_1 = require("@nestjs/common");
const use_cases_module_1 = require("../../core/use-cases/use-cases.module");
const auth_controller_1 = require("./controllers/auth.controller");
const companies_controller_1 = require("./controllers/companies.controller");
const health_controller_1 = require("./controllers/health.controller");
let HttpModule = class HttpModule {
};
exports.HttpModule = HttpModule;
exports.HttpModule = HttpModule = __decorate([
    (0, common_1.Module)({
        imports: [use_cases_module_1.UseCasesModule],
        controllers: [health_controller_1.HealthController, auth_controller_1.AuthController, companies_controller_1.CompaniesController],
    })
], HttpModule);
//# sourceMappingURL=http.module.js.map