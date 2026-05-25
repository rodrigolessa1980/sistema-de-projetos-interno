import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
export interface LoginInput {
    email: string;
    password: string;
}
export interface LoginOutput {
    user: User;
    token: string;
    expiresAt: Date;
}
export declare class LoginUseCase {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: IUserRepository, jwtService: JwtService);
    execute(input: LoginInput): Promise<LoginOutput>;
}
