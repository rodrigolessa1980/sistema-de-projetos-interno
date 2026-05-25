import { UserRole } from './enums';
export interface UserProps {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
    avatar?: string | null;
    position: string;
    department: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class User {
    private props;
    constructor(props: UserProps);
    private validate;
    get id(): string;
    get name(): string;
    get email(): string;
    get passwordHash(): string;
    get role(): UserRole;
    get avatar(): string | null;
    get position(): string;
    get department(): string;
    get createdAt(): Date;
    get updatedAt(): Date;
}
