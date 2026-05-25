import { LoginUseCase } from '../../../core/use-cases/auth/login.use-case';
import { GetCurrentUserUseCase } from '../../../core/use-cases/auth/get-current-user.use-case';
import { LoginDto } from '../dtos/auth/login.dto';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';
export declare class AuthController {
    private readonly loginUseCase;
    private readonly getCurrentUserUseCase;
    constructor(loginUseCase: LoginUseCase, getCurrentUserUseCase: GetCurrentUserUseCase);
    login(body: LoginDto): Promise<{
        user: import("../presenters/user.presenter").UserResponse;
        token: string;
        expiresAt: string;
    }>;
    me(req: AuthenticatedRequest): Promise<{
        user: import("../presenters/user.presenter").UserResponse;
    }>;
}
