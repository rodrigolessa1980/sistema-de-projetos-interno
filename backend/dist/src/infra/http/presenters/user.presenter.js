"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPresenter = void 0;
class UserPresenter {
    static toHTTP(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            position: user.position,
            department: user.department,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }
}
exports.UserPresenter = UserPresenter;
//# sourceMappingURL=user.presenter.js.map