import { ProjectStatus } from './enums';
export interface ProjectProps {
    id?: string;
    companyId: string;
    name: string;
    description: string;
    status?: ProjectStatus;
    ownerId: string;
    startDate: Date;
    endDate?: Date | null;
    estimatedHours?: number;
    actualHours?: number;
    progress?: number;
    color?: string;
    avatar?: string | null;
    testUrl?: string | null;
    queueOrder?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Project {
    private props;
    constructor(props: ProjectProps);
    private validate;
    get id(): string;
    get companyId(): string;
    get name(): string;
    get description(): string;
    get status(): ProjectStatus;
    get ownerId(): string;
    get startDate(): Date;
    get endDate(): Date | null;
    get estimatedHours(): number;
    get actualHours(): number;
    get progress(): number;
    get color(): string;
    get avatar(): string | null;
    get testUrl(): string | null;
    get queueOrder(): number | null;
    get createdAt(): Date;
    get updatedAt(): Date;
    updateProgress(progress: number): void;
    setQueueOrder(order: number | null): void;
    updateHours(actualHours: number): void;
}
