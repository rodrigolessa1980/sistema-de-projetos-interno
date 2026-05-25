"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyPresenter = void 0;
class CompanyPresenter {
    static toHTTP(company) {
        return {
            id: company.id,
            name: company.name,
            shortName: company.shortName,
            color: company.color,
            cnpj: company.cnpj,
            createdAt: company.createdAt.toISOString(),
            updatedAt: company.updatedAt.toISOString(),
        };
    }
}
exports.CompanyPresenter = CompanyPresenter;
//# sourceMappingURL=company.presenter.js.map