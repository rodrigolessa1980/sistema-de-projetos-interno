import { TaskStatus } from './enums';
export interface TimeLogProps {
    id?: string;
    taskId: string;
    userId: string;
    hours: number;
    description: string;
    date: Date;
    status: TaskStatus;
    createdAt?: Date;
}
export declare class TimeLog {
    private props;
    constructor(props: TimeLogProps);
    private validate;
    get id(): string;
    get taskId(): string;
    get userId(): string;
    get hours(): number;
    get description(): string;
    get date(): Date;
    get status(): TaskStatus;
    get createdAt(): Date;
}
