import { User } from '../../../core/domain/entities/user.entity';
export interface UserResponse {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
    position: string;
    department: string;
    createdAt: string;
    updatedAt: string;
}
export declare class UserPresenter {
    static toHTTP(user: User): UserResponse;
}
