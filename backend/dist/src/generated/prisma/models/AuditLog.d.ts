import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type AuditLogModel = runtime.Types.Result.DefaultSelection<Prisma.$AuditLogPayload>;
export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null;
    _min: AuditLogMinAggregateOutputType | null;
    _max: AuditLogMaxAggregateOutputType | null;
};
export type AuditLogMinAggregateOutputType = {
    id: string | null;
    entityType: $Enums.AuditEntityType | null;
    entityId: string | null;
    action: $Enums.AuditAction | null;
    userId: string | null;
    description: string | null;
    createdAt: Date | null;
};
export type AuditLogMaxAggregateOutputType = {
    id: string | null;
    entityType: $Enums.AuditEntityType | null;
    entityId: string | null;
    action: $Enums.AuditAction | null;
    userId: string | null;
    description: string | null;
    createdAt: Date | null;
};
export type AuditLogCountAggregateOutputType = {
    id: number;
    entityType: number;
    entityId: number;
    action: number;
    userId: number;
    previousValue: number;
    newValue: number;
    description: number;
    createdAt: number;
    _all: number;
};
export type AuditLogMinAggregateInputType = {
    id?: true;
    entityType?: true;
    entityId?: true;
    action?: true;
    userId?: true;
    description?: true;
    createdAt?: true;
};
export type AuditLogMaxAggregateInputType = {
    id?: true;
    entityType?: true;
    entityId?: true;
    action?: true;
    userId?: true;
    description?: true;
    createdAt?: true;
};
export type AuditLogCountAggregateInputType = {
    id?: true;
    entityType?: true;
    entityId?: true;
    action?: true;
    userId?: true;
    previousValue?: true;
    newValue?: true;
    description?: true;
    createdAt?: true;
    _all?: true;
};
export type AuditLogAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuditLogWhereInput;
    orderBy?: Prisma.AuditLogOrderByWithRelationInput | Prisma.AuditLogOrderByWithRelationInput[];
    cursor?: Prisma.AuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AuditLogCountAggregateInputType;
    _min?: AuditLogMinAggregateInputType;
    _max?: AuditLogMaxAggregateInputType;
};
export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
    [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAuditLog[P]> : Prisma.GetScalarType<T[P], AggregateAuditLog[P]>;
};
export type AuditLogGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuditLogWhereInput;
    orderBy?: Prisma.AuditLogOrderByWithAggregationInput | Prisma.AuditLogOrderByWithAggregationInput[];
    by: Prisma.AuditLogScalarFieldEnum[] | Prisma.AuditLogScalarFieldEnum;
    having?: Prisma.AuditLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AuditLogCountAggregateInputType | true;
    _min?: AuditLogMinAggregateInputType;
    _max?: AuditLogMaxAggregateInputType;
};
export type AuditLogGroupByOutputType = {
    id: string;
    entityType: $Enums.AuditEntityType;
    entityId: string;
    action: $Enums.AuditAction;
    userId: string;
    previousValue: runtime.JsonValue | null;
    newValue: runtime.JsonValue | null;
    description: string;
    createdAt: Date;
    _count: AuditLogCountAggregateOutputType | null;
    _min: AuditLogMinAggregateOutputType | null;
    _max: AuditLogMaxAggregateOutputType | null;
};
export type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AuditLogGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AuditLogGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AuditLogGroupByOutputType[P]>;
}>>;
export type AuditLogWhereInput = {
    AND?: Prisma.AuditLogWhereInput | Prisma.AuditLogWhereInput[];
    OR?: Prisma.AuditLogWhereInput[];
    NOT?: Prisma.AuditLogWhereInput | Prisma.AuditLogWhereInput[];
    id?: Prisma.StringFilter<"AuditLog"> | string;
    entityType?: Prisma.EnumAuditEntityTypeFilter<"AuditLog"> | $Enums.AuditEntityType;
    entityId?: Prisma.StringFilter<"AuditLog"> | string;
    action?: Prisma.EnumAuditActionFilter<"AuditLog"> | $Enums.AuditAction;
    userId?: Prisma.StringFilter<"AuditLog"> | string;
    previousValue?: Prisma.JsonNullableFilter<"AuditLog">;
    newValue?: Prisma.JsonNullableFilter<"AuditLog">;
    description?: Prisma.StringFilter<"AuditLog"> | string;
    createdAt?: Prisma.DateTimeFilter<"AuditLog"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type AuditLogOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    entityId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    previousValue?: Prisma.SortOrderInput | Prisma.SortOrder;
    newValue?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    _relevance?: Prisma.AuditLogOrderByRelevanceInput;
};
export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.AuditLogWhereInput | Prisma.AuditLogWhereInput[];
    OR?: Prisma.AuditLogWhereInput[];
    NOT?: Prisma.AuditLogWhereInput | Prisma.AuditLogWhereInput[];
    entityType?: Prisma.EnumAuditEntityTypeFilter<"AuditLog"> | $Enums.AuditEntityType;
    entityId?: Prisma.StringFilter<"AuditLog"> | string;
    action?: Prisma.EnumAuditActionFilter<"AuditLog"> | $Enums.AuditAction;
    userId?: Prisma.StringFilter<"AuditLog"> | string;
    previousValue?: Prisma.JsonNullableFilter<"AuditLog">;
    newValue?: Prisma.JsonNullableFilter<"AuditLog">;
    description?: Prisma.StringFilter<"AuditLog"> | string;
    createdAt?: Prisma.DateTimeFilter<"AuditLog"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type AuditLogOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    entityId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    previousValue?: Prisma.SortOrderInput | Prisma.SortOrder;
    newValue?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.AuditLogCountOrderByAggregateInput;
    _max?: Prisma.AuditLogMaxOrderByAggregateInput;
    _min?: Prisma.AuditLogMinOrderByAggregateInput;
};
export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: Prisma.AuditLogScalarWhereWithAggregatesInput | Prisma.AuditLogScalarWhereWithAggregatesInput[];
    OR?: Prisma.AuditLogScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AuditLogScalarWhereWithAggregatesInput | Prisma.AuditLogScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"AuditLog"> | string;
    entityType?: Prisma.EnumAuditEntityTypeWithAggregatesFilter<"AuditLog"> | $Enums.AuditEntityType;
    entityId?: Prisma.StringWithAggregatesFilter<"AuditLog"> | string;
    action?: Prisma.EnumAuditActionWithAggregatesFilter<"AuditLog"> | $Enums.AuditAction;
    userId?: Prisma.StringWithAggregatesFilter<"AuditLog"> | string;
    previousValue?: Prisma.JsonNullableWithAggregatesFilter<"AuditLog">;
    newValue?: Prisma.JsonNullableWithAggregatesFilter<"AuditLog">;
    description?: Prisma.StringWithAggregatesFilter<"AuditLog"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"AuditLog"> | Date | string;
};
export type AuditLogCreateInput = {
    id?: string;
    entityType: $Enums.AuditEntityType;
    entityId: string;
    action: $Enums.AuditAction;
    previousValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    newValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    description: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutAuditLogsInput;
};
export type AuditLogUncheckedCreateInput = {
    id?: string;
    entityType: $Enums.AuditEntityType;
    entityId: string;
    action: $Enums.AuditAction;
    userId: string;
    previousValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    newValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    description: string;
    createdAt?: Date | string;
};
export type AuditLogUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.EnumAuditEntityTypeFieldUpdateOperationsInput | $Enums.AuditEntityType;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumAuditActionFieldUpdateOperationsInput | $Enums.AuditAction;
    previousValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    newValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutAuditLogsNestedInput;
};
export type AuditLogUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.EnumAuditEntityTypeFieldUpdateOperationsInput | $Enums.AuditEntityType;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumAuditActionFieldUpdateOperationsInput | $Enums.AuditAction;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    previousValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    newValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AuditLogCreateManyInput = {
    id?: string;
    entityType: $Enums.AuditEntityType;
    entityId: string;
    action: $Enums.AuditAction;
    userId: string;
    previousValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    newValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    description: string;
    createdAt?: Date | string;
};
export type AuditLogUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.EnumAuditEntityTypeFieldUpdateOperationsInput | $Enums.AuditEntityType;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumAuditActionFieldUpdateOperationsInput | $Enums.AuditAction;
    previousValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    newValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AuditLogUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.EnumAuditEntityTypeFieldUpdateOperationsInput | $Enums.AuditEntityType;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumAuditActionFieldUpdateOperationsInput | $Enums.AuditAction;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    previousValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    newValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AuditLogListRelationFilter = {
    every?: Prisma.AuditLogWhereInput;
    some?: Prisma.AuditLogWhereInput;
    none?: Prisma.AuditLogWhereInput;
};
export type AuditLogOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AuditLogOrderByRelevanceInput = {
    fields: Prisma.AuditLogOrderByRelevanceFieldEnum | Prisma.AuditLogOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type AuditLogCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    entityId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    previousValue?: Prisma.SortOrder;
    newValue?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type AuditLogMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    entityId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type AuditLogMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    entityId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.AuditLogCreateWithoutUserInput, Prisma.AuditLogUncheckedCreateWithoutUserInput> | Prisma.AuditLogCreateWithoutUserInput[] | Prisma.AuditLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AuditLogCreateOrConnectWithoutUserInput | Prisma.AuditLogCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.AuditLogCreateManyUserInputEnvelope;
    connect?: Prisma.AuditLogWhereUniqueInput | Prisma.AuditLogWhereUniqueInput[];
};
export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.AuditLogCreateWithoutUserInput, Prisma.AuditLogUncheckedCreateWithoutUserInput> | Prisma.AuditLogCreateWithoutUserInput[] | Prisma.AuditLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AuditLogCreateOrConnectWithoutUserInput | Prisma.AuditLogCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.AuditLogCreateManyUserInputEnvelope;
    connect?: Prisma.AuditLogWhereUniqueInput | Prisma.AuditLogWhereUniqueInput[];
};
export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.AuditLogCreateWithoutUserInput, Prisma.AuditLogUncheckedCreateWithoutUserInput> | Prisma.AuditLogCreateWithoutUserInput[] | Prisma.AuditLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AuditLogCreateOrConnectWithoutUserInput | Prisma.AuditLogCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.AuditLogUpsertWithWhereUniqueWithoutUserInput | Prisma.AuditLogUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.AuditLogCreateManyUserInputEnvelope;
    set?: Prisma.AuditLogWhereUniqueInput | Prisma.AuditLogWhereUniqueInput[];
    disconnect?: Prisma.AuditLogWhereUniqueInput | Prisma.AuditLogWhereUniqueInput[];
    delete?: Prisma.AuditLogWhereUniqueInput | Prisma.AuditLogWhereUniqueInput[];
    connect?: Prisma.AuditLogWhereUniqueInput | Prisma.AuditLogWhereUniqueInput[];
    update?: Prisma.AuditLogUpdateWithWhereUniqueWithoutUserInput | Prisma.AuditLogUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.AuditLogUpdateManyWithWhereWithoutUserInput | Prisma.AuditLogUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.AuditLogScalarWhereInput | Prisma.AuditLogScalarWhereInput[];
};
export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.AuditLogCreateWithoutUserInput, Prisma.AuditLogUncheckedCreateWithoutUserInput> | Prisma.AuditLogCreateWithoutUserInput[] | Prisma.AuditLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AuditLogCreateOrConnectWithoutUserInput | Prisma.AuditLogCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.AuditLogUpsertWithWhereUniqueWithoutUserInput | Prisma.AuditLogUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.AuditLogCreateManyUserInputEnvelope;
    set?: Prisma.AuditLogWhereUniqueInput | Prisma.AuditLogWhereUniqueInput[];
    disconnect?: Prisma.AuditLogWhereUniqueInput | Prisma.AuditLogWhereUniqueInput[];
    delete?: Prisma.AuditLogWhereUniqueInput | Prisma.AuditLogWhereUniqueInput[];
    connect?: Prisma.AuditLogWhereUniqueInput | Prisma.AuditLogWhereUniqueInput[];
    update?: Prisma.AuditLogUpdateWithWhereUniqueWithoutUserInput | Prisma.AuditLogUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.AuditLogUpdateManyWithWhereWithoutUserInput | Prisma.AuditLogUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.AuditLogScalarWhereInput | Prisma.AuditLogScalarWhereInput[];
};
export type EnumAuditEntityTypeFieldUpdateOperationsInput = {
    set?: $Enums.AuditEntityType;
};
export type EnumAuditActionFieldUpdateOperationsInput = {
    set?: $Enums.AuditAction;
};
export type AuditLogCreateWithoutUserInput = {
    id?: string;
    entityType: $Enums.AuditEntityType;
    entityId: string;
    action: $Enums.AuditAction;
    previousValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    newValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    description: string;
    createdAt?: Date | string;
};
export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string;
    entityType: $Enums.AuditEntityType;
    entityId: string;
    action: $Enums.AuditAction;
    previousValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    newValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    description: string;
    createdAt?: Date | string;
};
export type AuditLogCreateOrConnectWithoutUserInput = {
    where: Prisma.AuditLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.AuditLogCreateWithoutUserInput, Prisma.AuditLogUncheckedCreateWithoutUserInput>;
};
export type AuditLogCreateManyUserInputEnvelope = {
    data: Prisma.AuditLogCreateManyUserInput | Prisma.AuditLogCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.AuditLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.AuditLogUpdateWithoutUserInput, Prisma.AuditLogUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.AuditLogCreateWithoutUserInput, Prisma.AuditLogUncheckedCreateWithoutUserInput>;
};
export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.AuditLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.AuditLogUpdateWithoutUserInput, Prisma.AuditLogUncheckedUpdateWithoutUserInput>;
};
export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.AuditLogScalarWhereInput;
    data: Prisma.XOR<Prisma.AuditLogUpdateManyMutationInput, Prisma.AuditLogUncheckedUpdateManyWithoutUserInput>;
};
export type AuditLogScalarWhereInput = {
    AND?: Prisma.AuditLogScalarWhereInput | Prisma.AuditLogScalarWhereInput[];
    OR?: Prisma.AuditLogScalarWhereInput[];
    NOT?: Prisma.AuditLogScalarWhereInput | Prisma.AuditLogScalarWhereInput[];
    id?: Prisma.StringFilter<"AuditLog"> | string;
    entityType?: Prisma.EnumAuditEntityTypeFilter<"AuditLog"> | $Enums.AuditEntityType;
    entityId?: Prisma.StringFilter<"AuditLog"> | string;
    action?: Prisma.EnumAuditActionFilter<"AuditLog"> | $Enums.AuditAction;
    userId?: Prisma.StringFilter<"AuditLog"> | string;
    previousValue?: Prisma.JsonNullableFilter<"AuditLog">;
    newValue?: Prisma.JsonNullableFilter<"AuditLog">;
    description?: Prisma.StringFilter<"AuditLog"> | string;
    createdAt?: Prisma.DateTimeFilter<"AuditLog"> | Date | string;
};
export type AuditLogCreateManyUserInput = {
    id?: string;
    entityType: $Enums.AuditEntityType;
    entityId: string;
    action: $Enums.AuditAction;
    previousValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    newValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    description: string;
    createdAt?: Date | string;
};
export type AuditLogUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.EnumAuditEntityTypeFieldUpdateOperationsInput | $Enums.AuditEntityType;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumAuditActionFieldUpdateOperationsInput | $Enums.AuditAction;
    previousValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    newValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.EnumAuditEntityTypeFieldUpdateOperationsInput | $Enums.AuditEntityType;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumAuditActionFieldUpdateOperationsInput | $Enums.AuditAction;
    previousValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    newValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.EnumAuditEntityTypeFieldUpdateOperationsInput | $Enums.AuditEntityType;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.EnumAuditActionFieldUpdateOperationsInput | $Enums.AuditAction;
    previousValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    newValue?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AuditLogSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    entityType?: boolean;
    entityId?: boolean;
    action?: boolean;
    userId?: boolean;
    previousValue?: boolean;
    newValue?: boolean;
    description?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["auditLog"]>;
export type AuditLogSelectScalar = {
    id?: boolean;
    entityType?: boolean;
    entityId?: boolean;
    action?: boolean;
    userId?: boolean;
    previousValue?: boolean;
    newValue?: boolean;
    description?: boolean;
    createdAt?: boolean;
};
export type AuditLogOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "entityType" | "entityId" | "action" | "userId" | "previousValue" | "newValue" | "description" | "createdAt", ExtArgs["result"]["auditLog"]>;
export type AuditLogInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $AuditLogPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "AuditLog";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        entityType: $Enums.AuditEntityType;
        entityId: string;
        action: $Enums.AuditAction;
        userId: string;
        previousValue: runtime.JsonValue | null;
        newValue: runtime.JsonValue | null;
        description: string;
        createdAt: Date;
    }, ExtArgs["result"]["auditLog"]>;
    composites: {};
};
export type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AuditLogPayload, S>;
export type AuditLogCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AuditLogCountAggregateInputType | true;
};
export interface AuditLogDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'];
        meta: {
            name: 'AuditLog';
        };
    };
    findUnique<T extends AuditLogFindUniqueArgs>(args: Prisma.SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AuditLogClient<runtime.Types.Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AuditLogClient<runtime.Types.Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AuditLogFindFirstArgs>(args?: Prisma.SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma.Prisma__AuditLogClient<runtime.Types.Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AuditLogClient<runtime.Types.Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AuditLogFindManyArgs>(args?: Prisma.SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AuditLogCreateArgs>(args: Prisma.SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma.Prisma__AuditLogClient<runtime.Types.Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AuditLogCreateManyArgs>(args?: Prisma.SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends AuditLogDeleteArgs>(args: Prisma.SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma.Prisma__AuditLogClient<runtime.Types.Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AuditLogUpdateArgs>(args: Prisma.SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma.Prisma__AuditLogClient<runtime.Types.Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: Prisma.SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AuditLogUpdateManyArgs>(args: Prisma.SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends AuditLogUpsertArgs>(args: Prisma.SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma.Prisma__AuditLogClient<runtime.Types.Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AuditLogCountArgs>(args?: Prisma.Subset<T, AuditLogCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AuditLogCountAggregateOutputType> : number>;
    aggregate<T extends AuditLogAggregateArgs>(args: Prisma.Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>;
    groupBy<T extends AuditLogGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AuditLogGroupByArgs['orderBy'];
    } : {
        orderBy?: AuditLogGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AuditLogFieldRefs;
}
export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AuditLogFieldRefs {
    readonly id: Prisma.FieldRef<"AuditLog", 'String'>;
    readonly entityType: Prisma.FieldRef<"AuditLog", 'AuditEntityType'>;
    readonly entityId: Prisma.FieldRef<"AuditLog", 'String'>;
    readonly action: Prisma.FieldRef<"AuditLog", 'AuditAction'>;
    readonly userId: Prisma.FieldRef<"AuditLog", 'String'>;
    readonly previousValue: Prisma.FieldRef<"AuditLog", 'Json'>;
    readonly newValue: Prisma.FieldRef<"AuditLog", 'Json'>;
    readonly description: Prisma.FieldRef<"AuditLog", 'String'>;
    readonly createdAt: Prisma.FieldRef<"AuditLog", 'DateTime'>;
}
export type AuditLogFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
    where: Prisma.AuditLogWhereUniqueInput;
};
export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
    where: Prisma.AuditLogWhereUniqueInput;
};
export type AuditLogFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
    where?: Prisma.AuditLogWhereInput;
    orderBy?: Prisma.AuditLogOrderByWithRelationInput | Prisma.AuditLogOrderByWithRelationInput[];
    cursor?: Prisma.AuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AuditLogScalarFieldEnum | Prisma.AuditLogScalarFieldEnum[];
};
export type AuditLogFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
    where?: Prisma.AuditLogWhereInput;
    orderBy?: Prisma.AuditLogOrderByWithRelationInput | Prisma.AuditLogOrderByWithRelationInput[];
    cursor?: Prisma.AuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AuditLogScalarFieldEnum | Prisma.AuditLogScalarFieldEnum[];
};
export type AuditLogFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
    where?: Prisma.AuditLogWhereInput;
    orderBy?: Prisma.AuditLogOrderByWithRelationInput | Prisma.AuditLogOrderByWithRelationInput[];
    cursor?: Prisma.AuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AuditLogScalarFieldEnum | Prisma.AuditLogScalarFieldEnum[];
};
export type AuditLogCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AuditLogCreateInput, Prisma.AuditLogUncheckedCreateInput>;
};
export type AuditLogCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AuditLogCreateManyInput | Prisma.AuditLogCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AuditLogUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AuditLogUpdateInput, Prisma.AuditLogUncheckedUpdateInput>;
    where: Prisma.AuditLogWhereUniqueInput;
};
export type AuditLogUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AuditLogUpdateManyMutationInput, Prisma.AuditLogUncheckedUpdateManyInput>;
    where?: Prisma.AuditLogWhereInput;
    limit?: number;
};
export type AuditLogUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
    where: Prisma.AuditLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.AuditLogCreateInput, Prisma.AuditLogUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AuditLogUpdateInput, Prisma.AuditLogUncheckedUpdateInput>;
};
export type AuditLogDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
    where: Prisma.AuditLogWhereUniqueInput;
};
export type AuditLogDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuditLogWhereInput;
    limit?: number;
};
export type AuditLogDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
};
