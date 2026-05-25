import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type StatusHistoryModel = runtime.Types.Result.DefaultSelection<Prisma.$StatusHistoryPayload>;
export type AggregateStatusHistory = {
    _count: StatusHistoryCountAggregateOutputType | null;
    _avg: StatusHistoryAvgAggregateOutputType | null;
    _sum: StatusHistorySumAggregateOutputType | null;
    _min: StatusHistoryMinAggregateOutputType | null;
    _max: StatusHistoryMaxAggregateOutputType | null;
};
export type StatusHistoryAvgAggregateOutputType = {
    duration: number | null;
};
export type StatusHistorySumAggregateOutputType = {
    duration: number | null;
};
export type StatusHistoryMinAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    fromStatus: $Enums.TaskStatus | null;
    toStatus: $Enums.TaskStatus | null;
    userId: string | null;
    duration: number | null;
    createdAt: Date | null;
};
export type StatusHistoryMaxAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    fromStatus: $Enums.TaskStatus | null;
    toStatus: $Enums.TaskStatus | null;
    userId: string | null;
    duration: number | null;
    createdAt: Date | null;
};
export type StatusHistoryCountAggregateOutputType = {
    id: number;
    taskId: number;
    fromStatus: number;
    toStatus: number;
    userId: number;
    duration: number;
    createdAt: number;
    _all: number;
};
export type StatusHistoryAvgAggregateInputType = {
    duration?: true;
};
export type StatusHistorySumAggregateInputType = {
    duration?: true;
};
export type StatusHistoryMinAggregateInputType = {
    id?: true;
    taskId?: true;
    fromStatus?: true;
    toStatus?: true;
    userId?: true;
    duration?: true;
    createdAt?: true;
};
export type StatusHistoryMaxAggregateInputType = {
    id?: true;
    taskId?: true;
    fromStatus?: true;
    toStatus?: true;
    userId?: true;
    duration?: true;
    createdAt?: true;
};
export type StatusHistoryCountAggregateInputType = {
    id?: true;
    taskId?: true;
    fromStatus?: true;
    toStatus?: true;
    userId?: true;
    duration?: true;
    createdAt?: true;
    _all?: true;
};
export type StatusHistoryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StatusHistoryWhereInput;
    orderBy?: Prisma.StatusHistoryOrderByWithRelationInput | Prisma.StatusHistoryOrderByWithRelationInput[];
    cursor?: Prisma.StatusHistoryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StatusHistoryCountAggregateInputType;
    _avg?: StatusHistoryAvgAggregateInputType;
    _sum?: StatusHistorySumAggregateInputType;
    _min?: StatusHistoryMinAggregateInputType;
    _max?: StatusHistoryMaxAggregateInputType;
};
export type GetStatusHistoryAggregateType<T extends StatusHistoryAggregateArgs> = {
    [P in keyof T & keyof AggregateStatusHistory]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStatusHistory[P]> : Prisma.GetScalarType<T[P], AggregateStatusHistory[P]>;
};
export type StatusHistoryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StatusHistoryWhereInput;
    orderBy?: Prisma.StatusHistoryOrderByWithAggregationInput | Prisma.StatusHistoryOrderByWithAggregationInput[];
    by: Prisma.StatusHistoryScalarFieldEnum[] | Prisma.StatusHistoryScalarFieldEnum;
    having?: Prisma.StatusHistoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StatusHistoryCountAggregateInputType | true;
    _avg?: StatusHistoryAvgAggregateInputType;
    _sum?: StatusHistorySumAggregateInputType;
    _min?: StatusHistoryMinAggregateInputType;
    _max?: StatusHistoryMaxAggregateInputType;
};
export type StatusHistoryGroupByOutputType = {
    id: string;
    taskId: string;
    fromStatus: $Enums.TaskStatus;
    toStatus: $Enums.TaskStatus;
    userId: string;
    duration: number;
    createdAt: Date;
    _count: StatusHistoryCountAggregateOutputType | null;
    _avg: StatusHistoryAvgAggregateOutputType | null;
    _sum: StatusHistorySumAggregateOutputType | null;
    _min: StatusHistoryMinAggregateOutputType | null;
    _max: StatusHistoryMaxAggregateOutputType | null;
};
export type GetStatusHistoryGroupByPayload<T extends StatusHistoryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StatusHistoryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StatusHistoryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StatusHistoryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StatusHistoryGroupByOutputType[P]>;
}>>;
export type StatusHistoryWhereInput = {
    AND?: Prisma.StatusHistoryWhereInput | Prisma.StatusHistoryWhereInput[];
    OR?: Prisma.StatusHistoryWhereInput[];
    NOT?: Prisma.StatusHistoryWhereInput | Prisma.StatusHistoryWhereInput[];
    id?: Prisma.StringFilter<"StatusHistory"> | string;
    taskId?: Prisma.StringFilter<"StatusHistory"> | string;
    fromStatus?: Prisma.EnumTaskStatusFilter<"StatusHistory"> | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusFilter<"StatusHistory"> | $Enums.TaskStatus;
    userId?: Prisma.StringFilter<"StatusHistory"> | string;
    duration?: Prisma.IntFilter<"StatusHistory"> | number;
    createdAt?: Prisma.DateTimeFilter<"StatusHistory"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type StatusHistoryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    task?: Prisma.TaskOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    _relevance?: Prisma.StatusHistoryOrderByRelevanceInput;
};
export type StatusHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.StatusHistoryWhereInput | Prisma.StatusHistoryWhereInput[];
    OR?: Prisma.StatusHistoryWhereInput[];
    NOT?: Prisma.StatusHistoryWhereInput | Prisma.StatusHistoryWhereInput[];
    taskId?: Prisma.StringFilter<"StatusHistory"> | string;
    fromStatus?: Prisma.EnumTaskStatusFilter<"StatusHistory"> | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusFilter<"StatusHistory"> | $Enums.TaskStatus;
    userId?: Prisma.StringFilter<"StatusHistory"> | string;
    duration?: Prisma.IntFilter<"StatusHistory"> | number;
    createdAt?: Prisma.DateTimeFilter<"StatusHistory"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type StatusHistoryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.StatusHistoryCountOrderByAggregateInput;
    _avg?: Prisma.StatusHistoryAvgOrderByAggregateInput;
    _max?: Prisma.StatusHistoryMaxOrderByAggregateInput;
    _min?: Prisma.StatusHistoryMinOrderByAggregateInput;
    _sum?: Prisma.StatusHistorySumOrderByAggregateInput;
};
export type StatusHistoryScalarWhereWithAggregatesInput = {
    AND?: Prisma.StatusHistoryScalarWhereWithAggregatesInput | Prisma.StatusHistoryScalarWhereWithAggregatesInput[];
    OR?: Prisma.StatusHistoryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StatusHistoryScalarWhereWithAggregatesInput | Prisma.StatusHistoryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"StatusHistory"> | string;
    taskId?: Prisma.StringWithAggregatesFilter<"StatusHistory"> | string;
    fromStatus?: Prisma.EnumTaskStatusWithAggregatesFilter<"StatusHistory"> | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusWithAggregatesFilter<"StatusHistory"> | $Enums.TaskStatus;
    userId?: Prisma.StringWithAggregatesFilter<"StatusHistory"> | string;
    duration?: Prisma.IntWithAggregatesFilter<"StatusHistory"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"StatusHistory"> | Date | string;
};
export type StatusHistoryCreateInput = {
    id?: string;
    fromStatus: $Enums.TaskStatus;
    toStatus: $Enums.TaskStatus;
    duration?: number;
    createdAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutStatusHistoriesInput;
    user: Prisma.UserCreateNestedOneWithoutStatusHistoriesInput;
};
export type StatusHistoryUncheckedCreateInput = {
    id?: string;
    taskId: string;
    fromStatus: $Enums.TaskStatus;
    toStatus: $Enums.TaskStatus;
    userId: string;
    duration?: number;
    createdAt?: Date | string;
};
export type StatusHistoryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fromStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutStatusHistoriesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutStatusHistoriesNestedInput;
};
export type StatusHistoryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistoryCreateManyInput = {
    id?: string;
    taskId: string;
    fromStatus: $Enums.TaskStatus;
    toStatus: $Enums.TaskStatus;
    userId: string;
    duration?: number;
    createdAt?: Date | string;
};
export type StatusHistoryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fromStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistoryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistoryListRelationFilter = {
    every?: Prisma.StatusHistoryWhereInput;
    some?: Prisma.StatusHistoryWhereInput;
    none?: Prisma.StatusHistoryWhereInput;
};
export type StatusHistoryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StatusHistoryOrderByRelevanceInput = {
    fields: Prisma.StatusHistoryOrderByRelevanceFieldEnum | Prisma.StatusHistoryOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type StatusHistoryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StatusHistoryAvgOrderByAggregateInput = {
    duration?: Prisma.SortOrder;
};
export type StatusHistoryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StatusHistoryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    fromStatus?: Prisma.SortOrder;
    toStatus?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StatusHistorySumOrderByAggregateInput = {
    duration?: Prisma.SortOrder;
};
export type StatusHistoryCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutUserInput, Prisma.StatusHistoryUncheckedCreateWithoutUserInput> | Prisma.StatusHistoryCreateWithoutUserInput[] | Prisma.StatusHistoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutUserInput | Prisma.StatusHistoryCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.StatusHistoryCreateManyUserInputEnvelope;
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
};
export type StatusHistoryUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutUserInput, Prisma.StatusHistoryUncheckedCreateWithoutUserInput> | Prisma.StatusHistoryCreateWithoutUserInput[] | Prisma.StatusHistoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutUserInput | Prisma.StatusHistoryCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.StatusHistoryCreateManyUserInputEnvelope;
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
};
export type StatusHistoryUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutUserInput, Prisma.StatusHistoryUncheckedCreateWithoutUserInput> | Prisma.StatusHistoryCreateWithoutUserInput[] | Prisma.StatusHistoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutUserInput | Prisma.StatusHistoryCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.StatusHistoryUpsertWithWhereUniqueWithoutUserInput | Prisma.StatusHistoryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.StatusHistoryCreateManyUserInputEnvelope;
    set?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    disconnect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    delete?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    update?: Prisma.StatusHistoryUpdateWithWhereUniqueWithoutUserInput | Prisma.StatusHistoryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.StatusHistoryUpdateManyWithWhereWithoutUserInput | Prisma.StatusHistoryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.StatusHistoryScalarWhereInput | Prisma.StatusHistoryScalarWhereInput[];
};
export type StatusHistoryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutUserInput, Prisma.StatusHistoryUncheckedCreateWithoutUserInput> | Prisma.StatusHistoryCreateWithoutUserInput[] | Prisma.StatusHistoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutUserInput | Prisma.StatusHistoryCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.StatusHistoryUpsertWithWhereUniqueWithoutUserInput | Prisma.StatusHistoryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.StatusHistoryCreateManyUserInputEnvelope;
    set?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    disconnect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    delete?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    update?: Prisma.StatusHistoryUpdateWithWhereUniqueWithoutUserInput | Prisma.StatusHistoryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.StatusHistoryUpdateManyWithWhereWithoutUserInput | Prisma.StatusHistoryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.StatusHistoryScalarWhereInput | Prisma.StatusHistoryScalarWhereInput[];
};
export type StatusHistoryCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutTaskInput, Prisma.StatusHistoryUncheckedCreateWithoutTaskInput> | Prisma.StatusHistoryCreateWithoutTaskInput[] | Prisma.StatusHistoryUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutTaskInput | Prisma.StatusHistoryCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.StatusHistoryCreateManyTaskInputEnvelope;
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
};
export type StatusHistoryUncheckedCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutTaskInput, Prisma.StatusHistoryUncheckedCreateWithoutTaskInput> | Prisma.StatusHistoryCreateWithoutTaskInput[] | Prisma.StatusHistoryUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutTaskInput | Prisma.StatusHistoryCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.StatusHistoryCreateManyTaskInputEnvelope;
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
};
export type StatusHistoryUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutTaskInput, Prisma.StatusHistoryUncheckedCreateWithoutTaskInput> | Prisma.StatusHistoryCreateWithoutTaskInput[] | Prisma.StatusHistoryUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutTaskInput | Prisma.StatusHistoryCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.StatusHistoryUpsertWithWhereUniqueWithoutTaskInput | Prisma.StatusHistoryUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.StatusHistoryCreateManyTaskInputEnvelope;
    set?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    disconnect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    delete?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    update?: Prisma.StatusHistoryUpdateWithWhereUniqueWithoutTaskInput | Prisma.StatusHistoryUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.StatusHistoryUpdateManyWithWhereWithoutTaskInput | Prisma.StatusHistoryUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.StatusHistoryScalarWhereInput | Prisma.StatusHistoryScalarWhereInput[];
};
export type StatusHistoryUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.StatusHistoryCreateWithoutTaskInput, Prisma.StatusHistoryUncheckedCreateWithoutTaskInput> | Prisma.StatusHistoryCreateWithoutTaskInput[] | Prisma.StatusHistoryUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.StatusHistoryCreateOrConnectWithoutTaskInput | Prisma.StatusHistoryCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.StatusHistoryUpsertWithWhereUniqueWithoutTaskInput | Prisma.StatusHistoryUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.StatusHistoryCreateManyTaskInputEnvelope;
    set?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    disconnect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    delete?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    connect?: Prisma.StatusHistoryWhereUniqueInput | Prisma.StatusHistoryWhereUniqueInput[];
    update?: Prisma.StatusHistoryUpdateWithWhereUniqueWithoutTaskInput | Prisma.StatusHistoryUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.StatusHistoryUpdateManyWithWhereWithoutTaskInput | Prisma.StatusHistoryUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.StatusHistoryScalarWhereInput | Prisma.StatusHistoryScalarWhereInput[];
};
export type StatusHistoryCreateWithoutUserInput = {
    id?: string;
    fromStatus: $Enums.TaskStatus;
    toStatus: $Enums.TaskStatus;
    duration?: number;
    createdAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutStatusHistoriesInput;
};
export type StatusHistoryUncheckedCreateWithoutUserInput = {
    id?: string;
    taskId: string;
    fromStatus: $Enums.TaskStatus;
    toStatus: $Enums.TaskStatus;
    duration?: number;
    createdAt?: Date | string;
};
export type StatusHistoryCreateOrConnectWithoutUserInput = {
    where: Prisma.StatusHistoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.StatusHistoryCreateWithoutUserInput, Prisma.StatusHistoryUncheckedCreateWithoutUserInput>;
};
export type StatusHistoryCreateManyUserInputEnvelope = {
    data: Prisma.StatusHistoryCreateManyUserInput | Prisma.StatusHistoryCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type StatusHistoryUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.StatusHistoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.StatusHistoryUpdateWithoutUserInput, Prisma.StatusHistoryUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.StatusHistoryCreateWithoutUserInput, Prisma.StatusHistoryUncheckedCreateWithoutUserInput>;
};
export type StatusHistoryUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.StatusHistoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.StatusHistoryUpdateWithoutUserInput, Prisma.StatusHistoryUncheckedUpdateWithoutUserInput>;
};
export type StatusHistoryUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.StatusHistoryScalarWhereInput;
    data: Prisma.XOR<Prisma.StatusHistoryUpdateManyMutationInput, Prisma.StatusHistoryUncheckedUpdateManyWithoutUserInput>;
};
export type StatusHistoryScalarWhereInput = {
    AND?: Prisma.StatusHistoryScalarWhereInput | Prisma.StatusHistoryScalarWhereInput[];
    OR?: Prisma.StatusHistoryScalarWhereInput[];
    NOT?: Prisma.StatusHistoryScalarWhereInput | Prisma.StatusHistoryScalarWhereInput[];
    id?: Prisma.StringFilter<"StatusHistory"> | string;
    taskId?: Prisma.StringFilter<"StatusHistory"> | string;
    fromStatus?: Prisma.EnumTaskStatusFilter<"StatusHistory"> | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusFilter<"StatusHistory"> | $Enums.TaskStatus;
    userId?: Prisma.StringFilter<"StatusHistory"> | string;
    duration?: Prisma.IntFilter<"StatusHistory"> | number;
    createdAt?: Prisma.DateTimeFilter<"StatusHistory"> | Date | string;
};
export type StatusHistoryCreateWithoutTaskInput = {
    id?: string;
    fromStatus: $Enums.TaskStatus;
    toStatus: $Enums.TaskStatus;
    duration?: number;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutStatusHistoriesInput;
};
export type StatusHistoryUncheckedCreateWithoutTaskInput = {
    id?: string;
    fromStatus: $Enums.TaskStatus;
    toStatus: $Enums.TaskStatus;
    userId: string;
    duration?: number;
    createdAt?: Date | string;
};
export type StatusHistoryCreateOrConnectWithoutTaskInput = {
    where: Prisma.StatusHistoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.StatusHistoryCreateWithoutTaskInput, Prisma.StatusHistoryUncheckedCreateWithoutTaskInput>;
};
export type StatusHistoryCreateManyTaskInputEnvelope = {
    data: Prisma.StatusHistoryCreateManyTaskInput | Prisma.StatusHistoryCreateManyTaskInput[];
    skipDuplicates?: boolean;
};
export type StatusHistoryUpsertWithWhereUniqueWithoutTaskInput = {
    where: Prisma.StatusHistoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.StatusHistoryUpdateWithoutTaskInput, Prisma.StatusHistoryUncheckedUpdateWithoutTaskInput>;
    create: Prisma.XOR<Prisma.StatusHistoryCreateWithoutTaskInput, Prisma.StatusHistoryUncheckedCreateWithoutTaskInput>;
};
export type StatusHistoryUpdateWithWhereUniqueWithoutTaskInput = {
    where: Prisma.StatusHistoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.StatusHistoryUpdateWithoutTaskInput, Prisma.StatusHistoryUncheckedUpdateWithoutTaskInput>;
};
export type StatusHistoryUpdateManyWithWhereWithoutTaskInput = {
    where: Prisma.StatusHistoryScalarWhereInput;
    data: Prisma.XOR<Prisma.StatusHistoryUpdateManyMutationInput, Prisma.StatusHistoryUncheckedUpdateManyWithoutTaskInput>;
};
export type StatusHistoryCreateManyUserInput = {
    id?: string;
    taskId: string;
    fromStatus: $Enums.TaskStatus;
    toStatus: $Enums.TaskStatus;
    duration?: number;
    createdAt?: Date | string;
};
export type StatusHistoryUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fromStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutStatusHistoriesNestedInput;
};
export type StatusHistoryUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistoryUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    fromStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistoryCreateManyTaskInput = {
    id?: string;
    fromStatus: $Enums.TaskStatus;
    toStatus: $Enums.TaskStatus;
    userId: string;
    duration?: number;
    createdAt?: Date | string;
};
export type StatusHistoryUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fromStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutStatusHistoriesNestedInput;
};
export type StatusHistoryUncheckedUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fromStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistoryUncheckedUpdateManyWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fromStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    toStatus?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StatusHistorySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    fromStatus?: boolean;
    toStatus?: boolean;
    userId?: boolean;
    duration?: boolean;
    createdAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["statusHistory"]>;
export type StatusHistorySelectScalar = {
    id?: boolean;
    taskId?: boolean;
    fromStatus?: boolean;
    toStatus?: boolean;
    userId?: boolean;
    duration?: boolean;
    createdAt?: boolean;
};
export type StatusHistoryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "taskId" | "fromStatus" | "toStatus" | "userId" | "duration" | "createdAt", ExtArgs["result"]["statusHistory"]>;
export type StatusHistoryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $StatusHistoryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StatusHistory";
    objects: {
        task: Prisma.$TaskPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        taskId: string;
        fromStatus: $Enums.TaskStatus;
        toStatus: $Enums.TaskStatus;
        userId: string;
        duration: number;
        createdAt: Date;
    }, ExtArgs["result"]["statusHistory"]>;
    composites: {};
};
export type StatusHistoryGetPayload<S extends boolean | null | undefined | StatusHistoryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload, S>;
export type StatusHistoryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StatusHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StatusHistoryCountAggregateInputType | true;
};
export interface StatusHistoryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StatusHistory'];
        meta: {
            name: 'StatusHistory';
        };
    };
    findUnique<T extends StatusHistoryFindUniqueArgs>(args: Prisma.SelectSubset<T, StatusHistoryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StatusHistoryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StatusHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StatusHistoryFindFirstArgs>(args?: Prisma.SelectSubset<T, StatusHistoryFindFirstArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StatusHistoryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StatusHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StatusHistoryFindManyArgs>(args?: Prisma.SelectSubset<T, StatusHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StatusHistoryCreateArgs>(args: Prisma.SelectSubset<T, StatusHistoryCreateArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StatusHistoryCreateManyArgs>(args?: Prisma.SelectSubset<T, StatusHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends StatusHistoryDeleteArgs>(args: Prisma.SelectSubset<T, StatusHistoryDeleteArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StatusHistoryUpdateArgs>(args: Prisma.SelectSubset<T, StatusHistoryUpdateArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StatusHistoryDeleteManyArgs>(args?: Prisma.SelectSubset<T, StatusHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StatusHistoryUpdateManyArgs>(args: Prisma.SelectSubset<T, StatusHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends StatusHistoryUpsertArgs>(args: Prisma.SelectSubset<T, StatusHistoryUpsertArgs<ExtArgs>>): Prisma.Prisma__StatusHistoryClient<runtime.Types.Result.GetResult<Prisma.$StatusHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StatusHistoryCountArgs>(args?: Prisma.Subset<T, StatusHistoryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StatusHistoryCountAggregateOutputType> : number>;
    aggregate<T extends StatusHistoryAggregateArgs>(args: Prisma.Subset<T, StatusHistoryAggregateArgs>): Prisma.PrismaPromise<GetStatusHistoryAggregateType<T>>;
    groupBy<T extends StatusHistoryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StatusHistoryGroupByArgs['orderBy'];
    } : {
        orderBy?: StatusHistoryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StatusHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStatusHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StatusHistoryFieldRefs;
}
export interface Prisma__StatusHistoryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    task<T extends Prisma.TaskDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskDefaultArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StatusHistoryFieldRefs {
    readonly id: Prisma.FieldRef<"StatusHistory", 'String'>;
    readonly taskId: Prisma.FieldRef<"StatusHistory", 'String'>;
    readonly fromStatus: Prisma.FieldRef<"StatusHistory", 'TaskStatus'>;
    readonly toStatus: Prisma.FieldRef<"StatusHistory", 'TaskStatus'>;
    readonly userId: Prisma.FieldRef<"StatusHistory", 'String'>;
    readonly duration: Prisma.FieldRef<"StatusHistory", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"StatusHistory", 'DateTime'>;
}
export type StatusHistoryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    where: Prisma.StatusHistoryWhereUniqueInput;
};
export type StatusHistoryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    where: Prisma.StatusHistoryWhereUniqueInput;
};
export type StatusHistoryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    where?: Prisma.StatusHistoryWhereInput;
    orderBy?: Prisma.StatusHistoryOrderByWithRelationInput | Prisma.StatusHistoryOrderByWithRelationInput[];
    cursor?: Prisma.StatusHistoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StatusHistoryScalarFieldEnum | Prisma.StatusHistoryScalarFieldEnum[];
};
export type StatusHistoryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    where?: Prisma.StatusHistoryWhereInput;
    orderBy?: Prisma.StatusHistoryOrderByWithRelationInput | Prisma.StatusHistoryOrderByWithRelationInput[];
    cursor?: Prisma.StatusHistoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StatusHistoryScalarFieldEnum | Prisma.StatusHistoryScalarFieldEnum[];
};
export type StatusHistoryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    where?: Prisma.StatusHistoryWhereInput;
    orderBy?: Prisma.StatusHistoryOrderByWithRelationInput | Prisma.StatusHistoryOrderByWithRelationInput[];
    cursor?: Prisma.StatusHistoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StatusHistoryScalarFieldEnum | Prisma.StatusHistoryScalarFieldEnum[];
};
export type StatusHistoryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StatusHistoryCreateInput, Prisma.StatusHistoryUncheckedCreateInput>;
};
export type StatusHistoryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StatusHistoryCreateManyInput | Prisma.StatusHistoryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StatusHistoryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StatusHistoryUpdateInput, Prisma.StatusHistoryUncheckedUpdateInput>;
    where: Prisma.StatusHistoryWhereUniqueInput;
};
export type StatusHistoryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StatusHistoryUpdateManyMutationInput, Prisma.StatusHistoryUncheckedUpdateManyInput>;
    where?: Prisma.StatusHistoryWhereInput;
    limit?: number;
};
export type StatusHistoryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    where: Prisma.StatusHistoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.StatusHistoryCreateInput, Prisma.StatusHistoryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StatusHistoryUpdateInput, Prisma.StatusHistoryUncheckedUpdateInput>;
};
export type StatusHistoryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
    where: Prisma.StatusHistoryWhereUniqueInput;
};
export type StatusHistoryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StatusHistoryWhereInput;
    limit?: number;
};
export type StatusHistoryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusHistorySelect<ExtArgs> | null;
    omit?: Prisma.StatusHistoryOmit<ExtArgs> | null;
    include?: Prisma.StatusHistoryInclude<ExtArgs> | null;
};
