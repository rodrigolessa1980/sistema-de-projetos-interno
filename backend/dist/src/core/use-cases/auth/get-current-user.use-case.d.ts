import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
export declare class GetCurrentUserUseCase {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(userId: string): Promise<User>;
}
