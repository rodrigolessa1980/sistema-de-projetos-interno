import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly Company: "Company";
    readonly User: "User";
    readonly Project: "Project";
    readonly ProjectDeveloper: "ProjectDeveloper";
    readonly Module: "Module";
    readonly Epic: "Epic";
    readonly Task: "Task";
    readonly Subtask: "Subtask";
    readonly TaskDependency: "TaskDependency";
    readonly TimeLog: "TimeLog";
    readonly Comment: "Comment";
    readonly Notification: "Notification";
    readonly AuditLog: "AuditLog";
    readonly StatusHistory: "StatusHistory";
    readonly TaskNote: "TaskNote";
    readonly TaskAttachment: "TaskAttachment";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "company" | "user" | "project" | "projectDeveloper" | "module" | "epic" | "task" | "subtask" | "taskDependency" | "timeLog" | "comment" | "notification" | "auditLog" | "statusHistory" | "taskNote" | "taskAttachment";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Company: {
            payload: Prisma.$CompanyPayload<ExtArgs>;
            fields: Prisma.CompanyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CompanyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CompanyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>;
                };
                findFirst: {
                    args: Prisma.CompanyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CompanyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>;
                };
                findMany: {
                    args: Prisma.CompanyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>[];
                };
                create: {
                    args: Prisma.CompanyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>;
                };
                createMany: {
                    args: Prisma.CompanyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.CompanyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>;
                };
                update: {
                    args: Prisma.CompanyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>;
                };
                deleteMany: {
                    args: Prisma.CompanyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CompanyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.CompanyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CompanyPayload>;
                };
                aggregate: {
                    args: Prisma.CompanyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCompany>;
                };
                groupBy: {
                    args: Prisma.CompanyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompanyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CompanyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompanyCountAggregateOutputType> | number;
                };
            };
        };
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Project: {
            payload: Prisma.$ProjectPayload<ExtArgs>;
            fields: Prisma.ProjectFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProjectFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>;
                };
                findFirst: {
                    args: Prisma.ProjectFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>;
                };
                findMany: {
                    args: Prisma.ProjectFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>[];
                };
                create: {
                    args: Prisma.ProjectCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>;
                };
                createMany: {
                    args: Prisma.ProjectCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ProjectDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>;
                };
                update: {
                    args: Prisma.ProjectUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>;
                };
                deleteMany: {
                    args: Prisma.ProjectDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProjectUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ProjectUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>;
                };
                aggregate: {
                    args: Prisma.ProjectAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProject>;
                };
                groupBy: {
                    args: Prisma.ProjectGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProjectGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProjectCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProjectCountAggregateOutputType> | number;
                };
            };
        };
        ProjectDeveloper: {
            payload: Prisma.$ProjectDeveloperPayload<ExtArgs>;
            fields: Prisma.ProjectDeveloperFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProjectDeveloperFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectDeveloperPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProjectDeveloperFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectDeveloperPayload>;
                };
                findFirst: {
                    args: Prisma.ProjectDeveloperFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectDeveloperPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProjectDeveloperFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectDeveloperPayload>;
                };
                findMany: {
                    args: Prisma.ProjectDeveloperFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectDeveloperPayload>[];
                };
                create: {
                    args: Prisma.ProjectDeveloperCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectDeveloperPayload>;
                };
                createMany: {
                    args: Prisma.ProjectDeveloperCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ProjectDeveloperDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectDeveloperPayload>;
                };
                update: {
                    args: Prisma.ProjectDeveloperUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectDeveloperPayload>;
                };
                deleteMany: {
                    args: Prisma.ProjectDeveloperDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProjectDeveloperUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ProjectDeveloperUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectDeveloperPayload>;
                };
                aggregate: {
                    args: Prisma.ProjectDeveloperAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProjectDeveloper>;
                };
                groupBy: {
                    args: Prisma.ProjectDeveloperGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProjectDeveloperGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProjectDeveloperCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProjectDeveloperCountAggregateOutputType> | number;
                };
            };
        };
        Module: {
            payload: Prisma.$ModulePayload<ExtArgs>;
            fields: Prisma.ModuleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ModuleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ModuleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>;
                };
                findFirst: {
                    args: Prisma.ModuleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ModuleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>;
                };
                findMany: {
                    args: Prisma.ModuleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>[];
                };
                create: {
                    args: Prisma.ModuleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>;
                };
                createMany: {
                    args: Prisma.ModuleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ModuleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>;
                };
                update: {
                    args: Prisma.ModuleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>;
                };
                deleteMany: {
                    args: Prisma.ModuleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ModuleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ModuleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>;
                };
                aggregate: {
                    args: Prisma.ModuleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateModule>;
                };
                groupBy: {
                    args: Prisma.ModuleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ModuleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ModuleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ModuleCountAggregateOutputType> | number;
                };
            };
        };
        Epic: {
            payload: Prisma.$EpicPayload<ExtArgs>;
            fields: Prisma.EpicFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EpicFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EpicPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EpicFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EpicPayload>;
                };
                findFirst: {
                    args: Prisma.EpicFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EpicPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EpicFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EpicPayload>;
                };
                findMany: {
                    args: Prisma.EpicFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EpicPayload>[];
                };
                create: {
                    args: Prisma.EpicCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EpicPayload>;
                };
                createMany: {
                    args: Prisma.EpicCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.EpicDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EpicPayload>;
                };
                update: {
                    args: Prisma.EpicUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EpicPayload>;
                };
                deleteMany: {
                    args: Prisma.EpicDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EpicUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.EpicUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EpicPayload>;
                };
                aggregate: {
                    args: Prisma.EpicAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEpic>;
                };
                groupBy: {
                    args: Prisma.EpicGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EpicGroupByOutputType>[];
                };
                count: {
                    args: Prisma.EpicCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EpicCountAggregateOutputType> | number;
                };
            };
        };
        Task: {
            payload: Prisma.$TaskPayload<ExtArgs>;
            fields: Prisma.TaskFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TaskFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                findFirst: {
                    args: Prisma.TaskFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                findMany: {
                    args: Prisma.TaskFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>[];
                };
                create: {
                    args: Prisma.TaskCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                createMany: {
                    args: Prisma.TaskCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TaskDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                update: {
                    args: Prisma.TaskUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                deleteMany: {
                    args: Prisma.TaskDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TaskUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TaskUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                aggregate: {
                    args: Prisma.TaskAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTask>;
                };
                groupBy: {
                    args: Prisma.TaskGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TaskCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskCountAggregateOutputType> | number;
                };
            };
        };
        Subtask: {
            payload: Prisma.$SubtaskPayload<ExtArgs>;
            fields: Prisma.SubtaskFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SubtaskFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubtaskPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SubtaskFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubtaskPayload>;
                };
                findFirst: {
                    args: Prisma.SubtaskFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubtaskPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SubtaskFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubtaskPayload>;
                };
                findMany: {
                    args: Prisma.SubtaskFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubtaskPayload>[];
                };
                create: {
                    args: Prisma.SubtaskCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubtaskPayload>;
                };
                createMany: {
                    args: Prisma.SubtaskCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.SubtaskDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubtaskPayload>;
                };
                update: {
                    args: Prisma.SubtaskUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubtaskPayload>;
                };
                deleteMany: {
                    args: Prisma.SubtaskDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SubtaskUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.SubtaskUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubtaskPayload>;
                };
                aggregate: {
                    args: Prisma.SubtaskAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSubtask>;
                };
                groupBy: {
                    args: Prisma.SubtaskGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubtaskGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SubtaskCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubtaskCountAggregateOutputType> | number;
                };
            };
        };
        TaskDependency: {
            payload: Prisma.$TaskDependencyPayload<ExtArgs>;
            fields: Prisma.TaskDependencyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TaskDependencyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskDependencyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TaskDependencyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskDependencyPayload>;
                };
                findFirst: {
                    args: Prisma.TaskDependencyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskDependencyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TaskDependencyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskDependencyPayload>;
                };
                findMany: {
                    args: Prisma.TaskDependencyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskDependencyPayload>[];
                };
                create: {
                    args: Prisma.TaskDependencyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskDependencyPayload>;
                };
                createMany: {
                    args: Prisma.TaskDependencyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TaskDependencyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskDependencyPayload>;
                };
                update: {
                    args: Prisma.TaskDependencyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskDependencyPayload>;
                };
                deleteMany: {
                    args: Prisma.TaskDependencyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TaskDependencyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TaskDependencyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskDependencyPayload>;
                };
                aggregate: {
                    args: Prisma.TaskDependencyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTaskDependency>;
                };
                groupBy: {
                    args: Prisma.TaskDependencyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskDependencyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TaskDependencyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskDependencyCountAggregateOutputType> | number;
                };
            };
        };
        TimeLog: {
            payload: Prisma.$TimeLogPayload<ExtArgs>;
            fields: Prisma.TimeLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TimeLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TimeLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeLogPayload>;
                };
                findFirst: {
                    args: Prisma.TimeLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TimeLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeLogPayload>;
                };
                findMany: {
                    args: Prisma.TimeLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeLogPayload>[];
                };
                create: {
                    args: Prisma.TimeLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeLogPayload>;
                };
                createMany: {
                    args: Prisma.TimeLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TimeLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeLogPayload>;
                };
                update: {
                    args: Prisma.TimeLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeLogPayload>;
                };
                deleteMany: {
                    args: Prisma.TimeLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TimeLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TimeLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeLogPayload>;
                };
                aggregate: {
                    args: Prisma.TimeLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTimeLog>;
                };
                groupBy: {
                    args: Prisma.TimeLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TimeLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TimeLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TimeLogCountAggregateOutputType> | number;
                };
            };
        };
        Comment: {
            payload: Prisma.$CommentPayload<ExtArgs>;
            fields: Prisma.CommentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CommentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                findFirst: {
                    args: Prisma.CommentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                findMany: {
                    args: Prisma.CommentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>[];
                };
                create: {
                    args: Prisma.CommentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                createMany: {
                    args: Prisma.CommentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.CommentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                update: {
                    args: Prisma.CommentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                deleteMany: {
                    args: Prisma.CommentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CommentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.CommentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                aggregate: {
                    args: Prisma.CommentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateComment>;
                };
                groupBy: {
                    args: Prisma.CommentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CommentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CommentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CommentCountAggregateOutputType> | number;
                };
            };
        };
        Notification: {
            payload: Prisma.$NotificationPayload<ExtArgs>;
            fields: Prisma.NotificationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.NotificationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findFirst: {
                    args: Prisma.NotificationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findMany: {
                    args: Prisma.NotificationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                create: {
                    args: Prisma.NotificationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                createMany: {
                    args: Prisma.NotificationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.NotificationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                update: {
                    args: Prisma.NotificationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                deleteMany: {
                    args: Prisma.NotificationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.NotificationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.NotificationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                aggregate: {
                    args: Prisma.NotificationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateNotification>;
                };
                groupBy: {
                    args: Prisma.NotificationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.NotificationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationCountAggregateOutputType> | number;
                };
            };
        };
        AuditLog: {
            payload: Prisma.$AuditLogPayload<ExtArgs>;
            fields: Prisma.AuditLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AuditLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findFirst: {
                    args: Prisma.AuditLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findMany: {
                    args: Prisma.AuditLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                create: {
                    args: Prisma.AuditLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                createMany: {
                    args: Prisma.AuditLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.AuditLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                update: {
                    args: Prisma.AuditLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                deleteMany: {
                    args: Prisma.AuditLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AuditLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.AuditLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                aggregate: {
                    args: Prisma.AuditLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAuditLog>;
                };
                groupBy: {
                    args: Prisma.AuditLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AuditLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogCountAggregateOutputType> | number;
                };
            };
        };
        StatusHistory: {
            payload: Prisma.$StatusHistoryPayload<ExtArgs>;
            fields: Prisma.StatusHistoryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StatusHistoryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusHistoryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StatusHistoryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusHistoryPayload>;
                };
                findFirst: {
                    args: Prisma.StatusHistoryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusHistoryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StatusHistoryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusHistoryPayload>;
                };
                findMany: {
                    args: Prisma.StatusHistoryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusHistoryPayload>[];
                };
                create: {
                    args: Prisma.StatusHistoryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusHistoryPayload>;
                };
                createMany: {
                    args: Prisma.StatusHistoryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.StatusHistoryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusHistoryPayload>;
                };
                update: {
                    args: Prisma.StatusHistoryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusHistoryPayload>;
                };
                deleteMany: {
                    args: Prisma.StatusHistoryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StatusHistoryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.StatusHistoryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusHistoryPayload>;
                };
                aggregate: {
                    args: Prisma.StatusHistoryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStatusHistory>;
                };
                groupBy: {
                    args: Prisma.StatusHistoryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StatusHistoryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StatusHistoryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StatusHistoryCountAggregateOutputType> | number;
                };
            };
        };
        TaskNote: {
            payload: Prisma.$TaskNotePayload<ExtArgs>;
            fields: Prisma.TaskNoteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TaskNoteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskNotePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TaskNoteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskNotePayload>;
                };
                findFirst: {
                    args: Prisma.TaskNoteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskNotePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TaskNoteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskNotePayload>;
                };
                findMany: {
                    args: Prisma.TaskNoteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskNotePayload>[];
                };
                create: {
                    args: Prisma.TaskNoteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskNotePayload>;
                };
                createMany: {
                    args: Prisma.TaskNoteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TaskNoteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskNotePayload>;
                };
                update: {
                    args: Prisma.TaskNoteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskNotePayload>;
                };
                deleteMany: {
                    args: Prisma.TaskNoteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TaskNoteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TaskNoteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskNotePayload>;
                };
                aggregate: {
                    args: Prisma.TaskNoteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTaskNote>;
                };
                groupBy: {
                    args: Prisma.TaskNoteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskNoteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TaskNoteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskNoteCountAggregateOutputType> | number;
                };
            };
        };
        TaskAttachment: {
            payload: Prisma.$TaskAttachmentPayload<ExtArgs>;
            fields: Prisma.TaskAttachmentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TaskAttachmentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAttachmentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TaskAttachmentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAttachmentPayload>;
                };
                findFirst: {
                    args: Prisma.TaskAttachmentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAttachmentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TaskAttachmentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAttachmentPayload>;
                };
                findMany: {
                    args: Prisma.TaskAttachmentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAttachmentPayload>[];
                };
                create: {
                    args: Prisma.TaskAttachmentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAttachmentPayload>;
                };
                createMany: {
                    args: Prisma.TaskAttachmentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TaskAttachmentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAttachmentPayload>;
                };
                update: {
                    args: Prisma.TaskAttachmentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAttachmentPayload>;
                };
                deleteMany: {
                    args: Prisma.TaskAttachmentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TaskAttachmentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TaskAttachmentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAttachmentPayload>;
                };
                aggregate: {
                    args: Prisma.TaskAttachmentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTaskAttachment>;
                };
                groupBy: {
                    args: Prisma.TaskAttachmentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskAttachmentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TaskAttachmentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskAttachmentCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const CompanyScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly shortName: "shortName";
    readonly color: "color";
    readonly cnpj: "cnpj";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly role: "role";
    readonly avatar: "avatar";
    readonly position: "position";
    readonly department: "department";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const ProjectScalarFieldEnum: {
    readonly id: "id";
    readonly companyId: "companyId";
    readonly name: "name";
    readonly description: "description";
    readonly status: "status";
    readonly ownerId: "ownerId";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly estimatedHours: "estimatedHours";
    readonly actualHours: "actualHours";
    readonly progress: "progress";
    readonly color: "color";
    readonly avatar: "avatar";
    readonly testUrl: "testUrl";
    readonly queueOrder: "queueOrder";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum];
export declare const ProjectDeveloperScalarFieldEnum: {
    readonly projectId: "projectId";
    readonly userId: "userId";
};
export type ProjectDeveloperScalarFieldEnum = (typeof ProjectDeveloperScalarFieldEnum)[keyof typeof ProjectDeveloperScalarFieldEnum];
export declare const ModuleScalarFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly name: "name";
    readonly description: "description";
    readonly order: "order";
    readonly progress: "progress";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ModuleScalarFieldEnum = (typeof ModuleScalarFieldEnum)[keyof typeof ModuleScalarFieldEnum];
export declare const EpicScalarFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly moduleId: "moduleId";
    readonly name: "name";
    readonly description: "description";
    readonly status: "status";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly progress: "progress";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EpicScalarFieldEnum = (typeof EpicScalarFieldEnum)[keyof typeof EpicScalarFieldEnum];
export declare const TaskScalarFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly moduleId: "moduleId";
    readonly epicId: "epicId";
    readonly parentTaskId: "parentTaskId";
    readonly title: "title";
    readonly description: "description";
    readonly status: "status";
    readonly complexity: "complexity";
    readonly assigneeId: "assigneeId";
    readonly reporterId: "reporterId";
    readonly estimatedHours: "estimatedHours";
    readonly actualHours: "actualHours";
    readonly startDate: "startDate";
    readonly dueDate: "dueDate";
    readonly completedAt: "completedAt";
    readonly blockedReason: "blockedReason";
    readonly isUrgent: "isUrgent";
    readonly urgentBlockedById: "urgentBlockedById";
    readonly urgentPreviousStatus: "urgentPreviousStatus";
    readonly order: "order";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum];
export declare const SubtaskScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly title: "title";
    readonly completed: "completed";
    readonly assigneeId: "assigneeId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SubtaskScalarFieldEnum = (typeof SubtaskScalarFieldEnum)[keyof typeof SubtaskScalarFieldEnum];
export declare const TaskDependencyScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly dependsOnTaskId: "dependsOnTaskId";
    readonly type: "type";
    readonly createdAt: "createdAt";
};
export type TaskDependencyScalarFieldEnum = (typeof TaskDependencyScalarFieldEnum)[keyof typeof TaskDependencyScalarFieldEnum];
export declare const TimeLogScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly hours: "hours";
    readonly description: "description";
    readonly date: "date";
    readonly status: "status";
    readonly createdAt: "createdAt";
};
export type TimeLogScalarFieldEnum = (typeof TimeLogScalarFieldEnum)[keyof typeof TimeLogScalarFieldEnum];
export declare const CommentScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly content: "content";
    readonly mentions: "mentions";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly type: "type";
    readonly title: "title";
    readonly message: "message";
    readonly read: "read";
    readonly relatedTaskId: "relatedTaskId";
    readonly relatedProjectId: "relatedProjectId";
    readonly createdAt: "createdAt";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly entityType: "entityType";
    readonly entityId: "entityId";
    readonly action: "action";
    readonly userId: "userId";
    readonly previousValue: "previousValue";
    readonly newValue: "newValue";
    readonly description: "description";
    readonly createdAt: "createdAt";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const StatusHistoryScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly fromStatus: "fromStatus";
    readonly toStatus: "toStatus";
    readonly userId: "userId";
    readonly duration: "duration";
    readonly createdAt: "createdAt";
};
export type StatusHistoryScalarFieldEnum = (typeof StatusHistoryScalarFieldEnum)[keyof typeof StatusHistoryScalarFieldEnum];
export declare const TaskNoteScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly content: "content";
    readonly isPinned: "isPinned";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TaskNoteScalarFieldEnum = (typeof TaskNoteScalarFieldEnum)[keyof typeof TaskNoteScalarFieldEnum];
export declare const TaskAttachmentScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly name: "name";
    readonly type: "type";
    readonly size: "size";
    readonly dataUrl: "dataUrl";
    readonly createdAt: "createdAt";
};
export type TaskAttachmentScalarFieldEnum = (typeof TaskAttachmentScalarFieldEnum)[keyof typeof TaskAttachmentScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: runtime.JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const CompanyOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly shortName: "shortName";
    readonly color: "color";
    readonly cnpj: "cnpj";
};
export type CompanyOrderByRelevanceFieldEnum = (typeof CompanyOrderByRelevanceFieldEnum)[keyof typeof CompanyOrderByRelevanceFieldEnum];
export declare const UserOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly avatar: "avatar";
    readonly position: "position";
    readonly department: "department";
};
export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum];
export declare const ProjectOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly companyId: "companyId";
    readonly name: "name";
    readonly description: "description";
    readonly ownerId: "ownerId";
    readonly color: "color";
    readonly avatar: "avatar";
    readonly testUrl: "testUrl";
};
export type ProjectOrderByRelevanceFieldEnum = (typeof ProjectOrderByRelevanceFieldEnum)[keyof typeof ProjectOrderByRelevanceFieldEnum];
export declare const ProjectDeveloperOrderByRelevanceFieldEnum: {
    readonly projectId: "projectId";
    readonly userId: "userId";
};
export type ProjectDeveloperOrderByRelevanceFieldEnum = (typeof ProjectDeveloperOrderByRelevanceFieldEnum)[keyof typeof ProjectDeveloperOrderByRelevanceFieldEnum];
export declare const ModuleOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly name: "name";
    readonly description: "description";
};
export type ModuleOrderByRelevanceFieldEnum = (typeof ModuleOrderByRelevanceFieldEnum)[keyof typeof ModuleOrderByRelevanceFieldEnum];
export declare const EpicOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly moduleId: "moduleId";
    readonly name: "name";
    readonly description: "description";
};
export type EpicOrderByRelevanceFieldEnum = (typeof EpicOrderByRelevanceFieldEnum)[keyof typeof EpicOrderByRelevanceFieldEnum];
export declare const TaskOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly moduleId: "moduleId";
    readonly epicId: "epicId";
    readonly parentTaskId: "parentTaskId";
    readonly title: "title";
    readonly description: "description";
    readonly assigneeId: "assigneeId";
    readonly reporterId: "reporterId";
    readonly blockedReason: "blockedReason";
    readonly urgentBlockedById: "urgentBlockedById";
};
export type TaskOrderByRelevanceFieldEnum = (typeof TaskOrderByRelevanceFieldEnum)[keyof typeof TaskOrderByRelevanceFieldEnum];
export declare const SubtaskOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly title: "title";
    readonly assigneeId: "assigneeId";
};
export type SubtaskOrderByRelevanceFieldEnum = (typeof SubtaskOrderByRelevanceFieldEnum)[keyof typeof SubtaskOrderByRelevanceFieldEnum];
export declare const TaskDependencyOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly dependsOnTaskId: "dependsOnTaskId";
};
export type TaskDependencyOrderByRelevanceFieldEnum = (typeof TaskDependencyOrderByRelevanceFieldEnum)[keyof typeof TaskDependencyOrderByRelevanceFieldEnum];
export declare const TimeLogOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly description: "description";
};
export type TimeLogOrderByRelevanceFieldEnum = (typeof TimeLogOrderByRelevanceFieldEnum)[keyof typeof TimeLogOrderByRelevanceFieldEnum];
export declare const JsonNullValueFilter: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const CommentOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly content: "content";
};
export type CommentOrderByRelevanceFieldEnum = (typeof CommentOrderByRelevanceFieldEnum)[keyof typeof CommentOrderByRelevanceFieldEnum];
export declare const NotificationOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly title: "title";
    readonly message: "message";
    readonly relatedTaskId: "relatedTaskId";
    readonly relatedProjectId: "relatedProjectId";
};
export type NotificationOrderByRelevanceFieldEnum = (typeof NotificationOrderByRelevanceFieldEnum)[keyof typeof NotificationOrderByRelevanceFieldEnum];
export declare const AuditLogOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly entityId: "entityId";
    readonly userId: "userId";
    readonly description: "description";
};
export type AuditLogOrderByRelevanceFieldEnum = (typeof AuditLogOrderByRelevanceFieldEnum)[keyof typeof AuditLogOrderByRelevanceFieldEnum];
export declare const StatusHistoryOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
};
export type StatusHistoryOrderByRelevanceFieldEnum = (typeof StatusHistoryOrderByRelevanceFieldEnum)[keyof typeof StatusHistoryOrderByRelevanceFieldEnum];
export declare const TaskNoteOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly content: "content";
};
export type TaskNoteOrderByRelevanceFieldEnum = (typeof TaskNoteOrderByRelevanceFieldEnum)[keyof typeof TaskNoteOrderByRelevanceFieldEnum];
export declare const TaskAttachmentOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly name: "name";
    readonly type: "type";
    readonly dataUrl: "dataUrl";
};
export type TaskAttachmentOrderByRelevanceFieldEnum = (typeof TaskAttachmentOrderByRelevanceFieldEnum)[keyof typeof TaskAttachmentOrderByRelevanceFieldEnum];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>;
export type EnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectStatus'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type EnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type EnumDependencyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DependencyType'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType'>;
export type EnumAuditEntityTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuditEntityType'>;
export type EnumAuditActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuditAction'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    accelerateUrl: string;
    adapter?: never;
}) & {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
};
export type GlobalOmitConfig = {
    company?: Prisma.CompanyOmit;
    user?: Prisma.UserOmit;
    project?: Prisma.ProjectOmit;
    projectDeveloper?: Prisma.ProjectDeveloperOmit;
    module?: Prisma.ModuleOmit;
    epic?: Prisma.EpicOmit;
    task?: Prisma.TaskOmit;
    subtask?: Prisma.SubtaskOmit;
    taskDependency?: Prisma.TaskDependencyOmit;
    timeLog?: Prisma.TimeLogOmit;
    comment?: Prisma.CommentOmit;
    notification?: Prisma.NotificationOmit;
    auditLog?: Prisma.AuditLogOmit;
    statusHistory?: Prisma.StatusHistoryOmit;
    taskNote?: Prisma.TaskNoteOmit;
    taskAttachment?: Prisma.TaskAttachmentOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
