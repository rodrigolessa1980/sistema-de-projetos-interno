export interface CompanyProps {
    id?: string;
    name: string;
    shortName: string;
    color: string;
    cnpj?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Company {
    private props;
    constructor(props: CompanyProps);
    private validate;
    get id(): string;
    get name(): string;
    get shortName(): string;
    get color(): string;
    get cnpj(): string | null;
    get createdAt(): Date;
    get updatedAt(): Date;
}
