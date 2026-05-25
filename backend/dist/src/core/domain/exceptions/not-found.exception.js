"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
const domain_exception_1 = require("./domain.exception");
class NotFoundException extends domain_exception_1.DomainException {
    constructor(resource, id) {
        super(id ? `${resource} com id "${id}" não encontrado.` : `${resource} não encontrado.`, 'NOT_FOUND');
    }
}
exports.NotFoundException = NotFoundException;
//# sourceMappingURL=not-found.exception.js.map