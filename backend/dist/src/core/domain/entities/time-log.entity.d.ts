import { TaskStatus, TimeLogSource } from './enums';
export interface TimeLogProps {
    id?: string;
    projectId: string;
    taskId: string;
    userId: string;
    hours: number;
    durationSeconds?: number | null;
    description: string;
    date: Date;
    startedAt?: Date | null;
    endedAt?: Date | null;
    source?: TimeLogSource;
    status: TaskStatus;
    createdAt?: Date;
}
export declare class TimeLog {
    private props;
    constructor(props: TimeLogProps);
    private validate;
    get id(): string;
    get projectId(): string;
    get taskId(): string;
    get userId(): string;
    get hours(): number;
    get durationSeconds(): number | null;
    get description(): string;
    get date(): Date;
    get startedAt(): Date | null;
    get endedAt(): Date | null;
    get source(): TimeLogSource;
    get status(): TaskStatus;
    get createdAt(): Date;
}
