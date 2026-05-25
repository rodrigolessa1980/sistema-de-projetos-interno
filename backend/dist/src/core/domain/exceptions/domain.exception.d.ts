export declare abstract class DomainException extends Error {
    readonly code: string;
    constructor(message: string, code: string);
}
