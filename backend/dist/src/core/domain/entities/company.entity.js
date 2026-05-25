"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
class Company {
    props;
    constructor(props) {
        this.props = {
            id: props.id || '',
            name: props.name,
            shortName: props.shortName,
            color: props.color || '#6366f1',
            cnpj: props.cnpj || null,
            createdAt: props.createdAt || new Date(),
            updatedAt: props.updatedAt || new Date(),
        };
        this.validate();
    }
    validate() {
        if (!this.props.name || this.props.name.trim().length === 0) {
            throw new Error('Nome da empresa é obrigatório.');
        }
        if (!this.props.shortName || this.props.shortName.trim().length === 0) {
            throw new Error('Sigla da empresa é obrigatória.');
        }
    }
    get id() { return this.props.id; }
    get name() { return this.props.name; }
    get shortName() { return this.props.shortName; }
    get color() { return this.props.color; }
    get cnpj() { return this.props.cnpj; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }
}
exports.Company = Company;
//# sourceMappingURL=company.entity.js.map