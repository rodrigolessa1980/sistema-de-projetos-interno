"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedException = void 0;
const domain_exception_1 = require("./domain.exception");
class UnauthorizedException extends domain_exception_1.DomainException {
    constructor(message = 'Credenciais inválidas.') {
        super(message, 'UNAUTHORIZED');
    }
}
exports.UnauthorizedException = UnauthorizedException;
//# sourceMappingURL=unauthorized.exception.js.map