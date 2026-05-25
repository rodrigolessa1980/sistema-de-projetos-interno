"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const enums_1 = require("./enums");
class User {
    props;
    constructor(props) {
        this.props = {
            id: props.id || '',
            name: props.name,
            email: props.email,
            passwordHash: props.passwordHash,
            role: props.role || enums_1.UserRole.DEVELOPER,
            avatar: props.avatar || null,
            position: props.position,
            department: props.department,
            createdAt: props.createdAt || new Date(),
            updatedAt: props.updatedAt || new Date(),
        };
        this.validate();
    }
    validate() {
        if (!this.props.name || this.props.name.trim().length === 0) {
            throw new Error('Nome do usuário é obrigatório.');
        }
        if (!this.props.email || !this.props.email.includes('@')) {
            throw new Error('E-mail do usuário deve ser válido.');
        }
    }
    get id() { return this.props.id; }
    get name() { return this.props.name; }
    get email() { return this.props.email; }
    get passwordHash() { return this.props.passwordHash; }
    get role() { return this.props.role; }
    get avatar() { return this.props.avatar; }
    get position() { return this.props.position; }
    get department() { return this.props.department; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map