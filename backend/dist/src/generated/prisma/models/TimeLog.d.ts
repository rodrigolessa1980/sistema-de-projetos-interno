import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TimeLogModel = runtime.Types.Result.DefaultSelection<Prisma.$TimeLogPayload>;
export type AggregateTimeLog = {
    _count: TimeLogCountAggregateOutputType | null;
    _avg: TimeLogAvgAggregateOutputType | null;
    _sum: TimeLogSumAggregateOutputType | null;
    _min: TimeLogMinAggregateOutputType | null;
    _max: TimeLogMaxAggregateOutputType | null;
};
export type TimeLogAvgAggregateOutputType = {
    hours: number | null;
};
export type TimeLogSumAggregateOutputType = {
    hours: number | null;
};
export type TimeLogMinAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    userId: string | null;
    hours: number | null;
    description: string | null;
    date: Date | null;
    status: $Enums.TaskStatus | null;
    createdAt: Date | null;
};
export type TimeLogMaxAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    userId: string | null;
    hours: number | null;
    description: string | null;
    date: Date | null;
    status: $Enums.TaskStatus | null;
    createdAt: Date | null;
};
export type TimeLogCountAggregateOutputType = {
    id: number;
    taskId: number;
    userId: number;
    hours: number;
    description: number;
    date: number;
    status: number;
    createdAt: number;
    _all: number;
};
export type TimeLogAvgAggregateInputType = {
    hours?: true;
};
export type TimeLogSumAggregateInputType = {
    hours?: true;
};
export type TimeLogMinAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    hours?: true;
    description?: true;
    date?: true;
    status?: true;
    createdAt?: true;
};
export type TimeLogMaxAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    hours?: true;
    description?: true;
    date?: true;
    status?: true;
    createdAt?: true;
};
export type TimeLogCountAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    hours?: true;
    description?: true;
    date?: true;
    status?: true;
    createdAt?: true;
    _all?: true;
};
export type TimeLogAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TimeLogWhereInput;
    orderBy?: Prisma.TimeLogOrderByWithRelationInput | Prisma.TimeLogOrderByWithRelationInput[];
    cursor?: Prisma.TimeLogWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TimeLogCountAggregateInputType;
    _avg?: TimeLogAvgAggregateInputType;
    _sum?: TimeLogSumAggregateInputType;
    _min?: TimeLogMinAggregateInputType;
    _max?: TimeLogMaxAggregateInputType;
};
export type GetTimeLogAggregateType<T extends TimeLogAggregateArgs> = {
    [P in keyof T & keyof AggregateTimeLog]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTimeLog[P]> : Prisma.GetScalarType<T[P], AggregateTimeLog[P]>;
};
export type TimeLogGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TimeLogWhereInput;
    orderBy?: Prisma.TimeLogOrderByWithAggregationInput | Prisma.TimeLogOrderByWithAggregationInput[];
    by: Prisma.TimeLogScalarFieldEnum[] | Prisma.TimeLogScalarFieldEnum;
    having?: Prisma.TimeLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TimeLogCountAggregateInputType | true;
    _avg?: TimeLogAvgAggregateInputType;
    _sum?: TimeLogSumAggregateInputType;
    _min?: TimeLogMinAggregateInputType;
    _max?: TimeLogMaxAggregateInputType;
};
export type TimeLogGroupByOutputType = {
    id: string;
    taskId: string;
    userId: string;
    hours: number;
    description: string;
    date: Date;
    status: $Enums.TaskStatus;
    createdAt: Date;
    _count: TimeLogCountAggregateOutputType | null;
    _avg: TimeLogAvgAggregateOutputType | null;
    _sum: TimeLogSumAggregateOutputType | null;
    _min: TimeLogMinAggregateOutputType | null;
    _max: TimeLogMaxAggregateOutputType | null;
};
export type GetTimeLogGroupByPayload<T extends TimeLogGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TimeLogGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TimeLogGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TimeLogGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TimeLogGroupByOutputType[P]>;
}>>;
export type TimeLogWhereInput = {
    AND?: Prisma.TimeLogWhereInput | Prisma.TimeLogWhereInput[];
    OR?: Prisma.TimeLogWhereInput[];
    NOT?: Prisma.TimeLogWhereInput | Prisma.TimeLogWhereInput[];
    id?: Prisma.StringFilter<"TimeLog"> | string;
    taskId?: Prisma.StringFilter<"TimeLog"> | string;
    userId?: Prisma.StringFilter<"TimeLog"> | string;
    hours?: Prisma.FloatFilter<"TimeLog"> | number;
    description?: Prisma.StringFilter<"TimeLog"> | string;
    date?: Prisma.DateTimeFilter<"TimeLog"> | Date | string;
    status?: Prisma.EnumTaskStatusFilter<"TimeLog"> | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeFilter<"TimeLog"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type TimeLogOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    hours?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    task?: Prisma.TaskOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    _relevance?: Prisma.TimeLogOrderByRelevanceInput;
};
export type TimeLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.TimeLogWhereInput | Prisma.TimeLogWhereInput[];
    OR?: Prisma.TimeLogWhereInput[];
    NOT?: Prisma.TimeLogWhereInput | Prisma.TimeLogWhereInput[];
    taskId?: Prisma.StringFilter<"TimeLog"> | string;
    userId?: Prisma.StringFilter<"TimeLog"> | string;
    hours?: Prisma.FloatFilter<"TimeLog"> | number;
    description?: Prisma.StringFilter<"TimeLog"> | string;
    date?: Prisma.DateTimeFilter<"TimeLog"> | Date | string;
    status?: Prisma.EnumTaskStatusFilter<"TimeLog"> | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeFilter<"TimeLog"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type TimeLogOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    hours?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.TimeLogCountOrderByAggregateInput;
    _avg?: Prisma.TimeLogAvgOrderByAggregateInput;
    _max?: Prisma.TimeLogMaxOrderByAggregateInput;
    _min?: Prisma.TimeLogMinOrderByAggregateInput;
    _sum?: Prisma.TimeLogSumOrderByAggregateInput;
};
export type TimeLogScalarWhereWithAggregatesInput = {
    AND?: Prisma.TimeLogScalarWhereWithAggregatesInput | Prisma.TimeLogScalarWhereWithAggregatesInput[];
    OR?: Prisma.TimeLogScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TimeLogScalarWhereWithAggregatesInput | Prisma.TimeLogScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"TimeLog"> | string;
    taskId?: Prisma.StringWithAggregatesFilter<"TimeLog"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"TimeLog"> | string;
    hours?: Prisma.FloatWithAggregatesFilter<"TimeLog"> | number;
    description?: Prisma.StringWithAggregatesFilter<"TimeLog"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"TimeLog"> | Date | string;
    status?: Prisma.EnumTaskStatusWithAggregatesFilter<"TimeLog"> | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"TimeLog"> | Date | string;
};
export type TimeLogCreateInput = {
    id?: string;
    hours: number;
    description: string;
    date: Date | string;
    status: $Enums.TaskStatus;
    createdAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutTimeLogsInput;
    user: Prisma.UserCreateNestedOneWithoutTimeLogsInput;
};
export type TimeLogUncheckedCreateInput = {
    id?: string;
    taskId: string;
    userId: string;
    hours: number;
    description: string;
    date: Date | string;
    status: $Enums.TaskStatus;
    createdAt?: Date | string;
};
export type TimeLogUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    hours?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutTimeLogsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutTimeLogsNestedInput;
};
export type TimeLogUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    hours?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TimeLogCreateManyInput = {
    id?: string;
    taskId: string;
    userId: string;
    hours: number;
    description: string;
    date: Date | string;
    status: $Enums.TaskStatus;
    createdAt?: Date | string;
};
export type TimeLogUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    hours?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TimeLogUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    hours?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TimeLogListRelationFilter = {
    every?: Prisma.TimeLogWhereInput;
    some?: Prisma.TimeLogWhereInput;
    none?: Prisma.TimeLogWhereInput;
};
export type TimeLogOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TimeLogOrderByRelevanceInput = {
    fields: Prisma.TimeLogOrderByRelevanceFieldEnum | Prisma.TimeLogOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type TimeLogCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    hours?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TimeLogAvgOrderByAggregateInput = {
    hours?: Prisma.SortOrder;
};
export type TimeLogMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    hours?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TimeLogMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    hours?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TimeLogSumOrderByAggregateInput = {
    hours?: Prisma.SortOrder;
};
export type TimeLogCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TimeLogCreateWithoutUserInput, Prisma.TimeLogUncheckedCreateWithoutUserInput> | Prisma.TimeLogCreateWithoutUserInput[] | Prisma.TimeLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TimeLogCreateOrConnectWithoutUserInput | Prisma.TimeLogCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TimeLogCreateManyUserInputEnvelope;
    connect?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
};
export type TimeLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TimeLogCreateWithoutUserInput, Prisma.TimeLogUncheckedCreateWithoutUserInput> | Prisma.TimeLogCreateWithoutUserInput[] | Prisma.TimeLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TimeLogCreateOrConnectWithoutUserInput | Prisma.TimeLogCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TimeLogCreateManyUserInputEnvelope;
    connect?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
};
export type TimeLogUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TimeLogCreateWithoutUserInput, Prisma.TimeLogUncheckedCreateWithoutUserInput> | Prisma.TimeLogCreateWithoutUserInput[] | Prisma.TimeLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TimeLogCreateOrConnectWithoutUserInput | Prisma.TimeLogCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TimeLogUpsertWithWhereUniqueWithoutUserInput | Prisma.TimeLogUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TimeLogCreateManyUserInputEnvelope;
    set?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    disconnect?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    delete?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    connect?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    update?: Prisma.TimeLogUpdateWithWhereUniqueWithoutUserInput | Prisma.TimeLogUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TimeLogUpdateManyWithWhereWithoutUserInput | Prisma.TimeLogUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TimeLogScalarWhereInput | Prisma.TimeLogScalarWhereInput[];
};
export type TimeLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TimeLogCreateWithoutUserInput, Prisma.TimeLogUncheckedCreateWithoutUserInput> | Prisma.TimeLogCreateWithoutUserInput[] | Prisma.TimeLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TimeLogCreateOrConnectWithoutUserInput | Prisma.TimeLogCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TimeLogUpsertWithWhereUniqueWithoutUserInput | Prisma.TimeLogUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TimeLogCreateManyUserInputEnvelope;
    set?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    disconnect?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    delete?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    connect?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    update?: Prisma.TimeLogUpdateWithWhereUniqueWithoutUserInput | Prisma.TimeLogUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TimeLogUpdateManyWithWhereWithoutUserInput | Prisma.TimeLogUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TimeLogScalarWhereInput | Prisma.TimeLogScalarWhereInput[];
};
export type TimeLogCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TimeLogCreateWithoutTaskInput, Prisma.TimeLogUncheckedCreateWithoutTaskInput> | Prisma.TimeLogCreateWithoutTaskInput[] | Prisma.TimeLogUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TimeLogCreateOrConnectWithoutTaskInput | Prisma.TimeLogCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TimeLogCreateManyTaskInputEnvelope;
    connect?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
};
export type TimeLogUncheckedCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TimeLogCreateWithoutTaskInput, Prisma.TimeLogUncheckedCreateWithoutTaskInput> | Prisma.TimeLogCreateWithoutTaskInput[] | Prisma.TimeLogUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TimeLogCreateOrConnectWithoutTaskInput | Prisma.TimeLogCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TimeLogCreateManyTaskInputEnvelope;
    connect?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
};
export type TimeLogUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TimeLogCreateWithoutTaskInput, Prisma.TimeLogUncheckedCreateWithoutTaskInput> | Prisma.TimeLogCreateWithoutTaskInput[] | Prisma.TimeLogUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TimeLogCreateOrConnectWithoutTaskInput | Prisma.TimeLogCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TimeLogUpsertWithWhereUniqueWithoutTaskInput | Prisma.TimeLogUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TimeLogCreateManyTaskInputEnvelope;
    set?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    disconnect?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    delete?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    connect?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    update?: Prisma.TimeLogUpdateWithWhereUniqueWithoutTaskInput | Prisma.TimeLogUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TimeLogUpdateManyWithWhereWithoutTaskInput | Prisma.TimeLogUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TimeLogScalarWhereInput | Prisma.TimeLogScalarWhereInput[];
};
export type TimeLogUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TimeLogCreateWithoutTaskInput, Prisma.TimeLogUncheckedCreateWithoutTaskInput> | Prisma.TimeLogCreateWithoutTaskInput[] | Prisma.TimeLogUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TimeLogCreateOrConnectWithoutTaskInput | Prisma.TimeLogCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TimeLogUpsertWithWhereUniqueWithoutTaskInput | Prisma.TimeLogUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TimeLogCreateManyTaskInputEnvelope;
    set?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    disconnect?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    delete?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    connect?: Prisma.TimeLogWhereUniqueInput | Prisma.TimeLogWhereUniqueInput[];
    update?: Prisma.TimeLogUpdateWithWhereUniqueWithoutTaskInput | Prisma.TimeLogUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TimeLogUpdateManyWithWhereWithoutTaskInput | Prisma.TimeLogUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TimeLogScalarWhereInput | Prisma.TimeLogScalarWhereInput[];
};
export type TimeLogCreateWithoutUserInput = {
    id?: string;
    hours: number;
    description: string;
    date: Date | string;
    status: $Enums.TaskStatus;
    createdAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutTimeLogsInput;
};
export type TimeLogUncheckedCreateWithoutUserInput = {
    id?: string;
    taskId: string;
    hours: number;
    description: string;
    date: Date | string;
    status: $Enums.TaskStatus;
    createdAt?: Date | string;
};
export type TimeLogCreateOrConnectWithoutUserInput = {
    where: Prisma.TimeLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.TimeLogCreateWithoutUserInput, Prisma.TimeLogUncheckedCreateWithoutUserInput>;
};
export type TimeLogCreateManyUserInputEnvelope = {
    data: Prisma.TimeLogCreateManyUserInput | Prisma.TimeLogCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type TimeLogUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.TimeLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.TimeLogUpdateWithoutUserInput, Prisma.TimeLogUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TimeLogCreateWithoutUserInput, Prisma.TimeLogUncheckedCreateWithoutUserInput>;
};
export type TimeLogUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.TimeLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.TimeLogUpdateWithoutUserInput, Prisma.TimeLogUncheckedUpdateWithoutUserInput>;
};
export type TimeLogUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.TimeLogScalarWhereInput;
    data: Prisma.XOR<Prisma.TimeLogUpdateManyMutationInput, Prisma.TimeLogUncheckedUpdateManyWithoutUserInput>;
};
export type TimeLogScalarWhereInput = {
    AND?: Prisma.TimeLogScalarWhereInput | Prisma.TimeLogScalarWhereInput[];
    OR?: Prisma.TimeLogScalarWhereInput[];
    NOT?: Prisma.TimeLogScalarWhereInput | Prisma.TimeLogScalarWhereInput[];
    id?: Prisma.StringFilter<"TimeLog"> | string;
    taskId?: Prisma.StringFilter<"TimeLog"> | string;
    userId?: Prisma.StringFilter<"TimeLog"> | string;
    hours?: Prisma.FloatFilter<"TimeLog"> | number;
    description?: Prisma.StringFilter<"TimeLog"> | string;
    date?: Prisma.DateTimeFilter<"TimeLog"> | Date | string;
    status?: Prisma.EnumTaskStatusFilter<"TimeLog"> | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeFilter<"TimeLog"> | Date | string;
};
export type TimeLogCreateWithoutTaskInput = {
    id?: string;
    hours: number;
    description: string;
    date: Date | string;
    status: $Enums.TaskStatus;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutTimeLogsInput;
};
export type TimeLogUncheckedCreateWithoutTaskInput = {
    id?: string;
    userId: string;
    hours: number;
    description: string;
    date: Date | string;
    status: $Enums.TaskStatus;
    createdAt?: Date | string;
};
export type TimeLogCreateOrConnectWithoutTaskInput = {
    where: Prisma.TimeLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.TimeLogCreateWithoutTaskInput, Prisma.TimeLogUncheckedCreateWithoutTaskInput>;
};
export type TimeLogCreateManyTaskInputEnvelope = {
    data: Prisma.TimeLogCreateManyTaskInput | Prisma.TimeLogCreateManyTaskInput[];
    skipDuplicates?: boolean;
};
export type TimeLogUpsertWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TimeLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.TimeLogUpdateWithoutTaskInput, Prisma.TimeLogUncheckedUpdateWithoutTaskInput>;
    create: Prisma.XOR<Prisma.TimeLogCreateWithoutTaskInput, Prisma.TimeLogUncheckedCreateWithoutTaskInput>;
};
export type TimeLogUpdateWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TimeLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.TimeLogUpdateWithoutTaskInput, Prisma.TimeLogUncheckedUpdateWithoutTaskInput>;
};
export type TimeLogUpdateManyWithWhereWithoutTaskInput = {
    where: Prisma.TimeLogScalarWhereInput;
    data: Prisma.XOR<Prisma.TimeLogUpdateManyMutationInput, Prisma.TimeLogUncheckedUpdateManyWithoutTaskInput>;
};
export type TimeLogCreateManyUserInput = {
    id?: string;
    taskId: string;
    hours: number;
    description: string;
    date: Date | string;
    status: $Enums.TaskStatus;
    createdAt?: Date | string;
};
export type TimeLogUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    hours?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutTimeLogsNestedInput;
};
export type TimeLogUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    hours?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TimeLogUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    hours?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TimeLogCreateManyTaskInput = {
    id?: string;
    userId: string;
    hours: number;
    description: string;
    date: Date | string;
    status: $Enums.TaskStatus;
    createdAt?: Date | string;
};
export type TimeLogUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    hours?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutTimeLogsNestedInput;
};
export type TimeLogUncheckedUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    hours?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TimeLogUncheckedUpdateManyWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    hours?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TimeLogSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    hours?: boolean;
    description?: boolean;
    date?: boolean;
    status?: boolean;
    createdAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["timeLog"]>;
export type TimeLogSelectScalar = {
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    hours?: boolean;
    description?: boolean;
    date?: boolean;
    status?: boolean;
    createdAt?: boolean;
};
export type TimeLogOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "taskId" | "userId" | "hours" | "description" | "date" | "status" | "createdAt", ExtArgs["result"]["timeLog"]>;
export type TimeLogInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $TimeLogPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TimeLog";
    objects: {
        task: Prisma.$TaskPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        taskId: string;
        userId: string;
        hours: number;
        description: string;
        date: Date;
        status: $Enums.TaskStatus;
        createdAt: Date;
    }, ExtArgs["result"]["timeLog"]>;
    composites: {};
};
export type TimeLogGetPayload<S extends boolean | null | undefined | TimeLogDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TimeLogPayload, S>;
export type TimeLogCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TimeLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TimeLogCountAggregateInputType | true;
};
export interface TimeLogDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TimeLog'];
        meta: {
            name: 'TimeLog';
        };
    };
    findUnique<T extends TimeLogFindUniqueArgs>(args: Prisma.SelectSubset<T, TimeLogFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TimeLogClient<runtime.Types.Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TimeLogFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TimeLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TimeLogClient<runtime.Types.Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TimeLogFindFirstArgs>(args?: Prisma.SelectSubset<T, TimeLogFindFirstArgs<ExtArgs>>): Prisma.Prisma__TimeLogClient<runtime.Types.Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TimeLogFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TimeLogFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TimeLogClient<runtime.Types.Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TimeLogFindManyArgs>(args?: Prisma.SelectSubset<T, TimeLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TimeLogCreateArgs>(args: Prisma.SelectSubset<T, TimeLogCreateArgs<ExtArgs>>): Prisma.Prisma__TimeLogClient<runtime.Types.Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TimeLogCreateManyArgs>(args?: Prisma.SelectSubset<T, TimeLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends TimeLogDeleteArgs>(args: Prisma.SelectSubset<T, TimeLogDeleteArgs<ExtArgs>>): Prisma.Prisma__TimeLogClient<runtime.Types.Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TimeLogUpdateArgs>(args: Prisma.SelectSubset<T, TimeLogUpdateArgs<ExtArgs>>): Prisma.Prisma__TimeLogClient<runtime.Types.Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TimeLogDeleteManyArgs>(args?: Prisma.SelectSubset<T, TimeLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TimeLogUpdateManyArgs>(args: Prisma.SelectSubset<T, TimeLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends TimeLogUpsertArgs>(args: Prisma.SelectSubset<T, TimeLogUpsertArgs<ExtArgs>>): Prisma.Prisma__TimeLogClient<runtime.Types.Result.GetResult<Prisma.$TimeLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TimeLogCountArgs>(args?: Prisma.Subset<T, TimeLogCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TimeLogCountAggregateOutputType> : number>;
    aggregate<T extends TimeLogAggregateArgs>(args: Prisma.Subset<T, TimeLogAggregateArgs>): Prisma.PrismaPromise<GetTimeLogAggregateType<T>>;
    groupBy<T extends TimeLogGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TimeLogGroupByArgs['orderBy'];
    } : {
        orderBy?: TimeLogGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TimeLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTimeLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TimeLogFieldRefs;
}
export interface Prisma__TimeLogClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    task<T extends Prisma.TaskDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskDefaultArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TimeLogFieldRefs {
    readonly id: Prisma.FieldRef<"TimeLog", 'String'>;
    readonly taskId: Prisma.FieldRef<"TimeLog", 'String'>;
    readonly userId: Prisma.FieldRef<"TimeLog", 'String'>;
    readonly hours: Prisma.FieldRef<"TimeLog", 'Float'>;
    readonly description: Prisma.FieldRef<"TimeLog", 'String'>;
    readonly date: Prisma.FieldRef<"TimeLog", 'DateTime'>;
    readonly status: Prisma.FieldRef<"TimeLog", 'TaskStatus'>;
    readonly createdAt: Prisma.FieldRef<"TimeLog", 'DateTime'>;
}
export type TimeLogFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeLogSelect<ExtArgs> | null;
    omit?: Prisma.TimeLogOmit<ExtArgs> | null;
    include?: Prisma.TimeLogInclude<ExtArgs> | null;
    where: Prisma.TimeLogWhereUniqueInput;
};
export type TimeLogFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeLogSelect<ExtArgs> | null;
    omit?: Prisma.TimeLogOmit<ExtArgs> | null;
    include?: Prisma.TimeLogInclude<ExtArgs> | null;
    where: Prisma.TimeLogWhereUniqueInput;
};
export type TimeLogFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeLogSelect<ExtArgs> | null;
    omit?: Prisma.TimeLogOmit<ExtArgs> | null;
    include?: Prisma.TimeLogInclude<ExtArgs> | null;
    where?: Prisma.TimeLogWhereInput;
    orderBy?: Prisma.TimeLogOrderByWithRelationInput | Prisma.TimeLogOrderByWithRelationInput[];
    cursor?: Prisma.TimeLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TimeLogScalarFieldEnum | Prisma.TimeLogScalarFieldEnum[];
};
export type TimeLogFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeLogSelect<ExtArgs> | null;
    omit?: Prisma.TimeLogOmit<ExtArgs> | null;
    include?: Prisma.TimeLogInclude<ExtArgs> | null;
    where?: Prisma.TimeLogWhereInput;
    orderBy?: Prisma.TimeLogOrderByWithRelationInput | Prisma.TimeLogOrderByWithRelationInput[];
    cursor?: Prisma.TimeLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TimeLogScalarFieldEnum | Prisma.TimeLogScalarFieldEnum[];
};
export type TimeLogFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeLogSelect<ExtArgs> | null;
    omit?: Prisma.TimeLogOmit<ExtArgs> | null;
    include?: Prisma.TimeLogInclude<ExtArgs> | null;
    where?: Prisma.TimeLogWhereInput;
    orderBy?: Prisma.TimeLogOrderByWithRelationInput | Prisma.TimeLogOrderByWithRelationInput[];
    cursor?: Prisma.TimeLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TimeLogScalarFieldEnum | Prisma.TimeLogScalarFieldEnum[];
};
export type TimeLogCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeLogSelect<ExtArgs> | null;
    omit?: Prisma.TimeLogOmit<ExtArgs> | null;
    include?: Prisma.TimeLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TimeLogCreateInput, Prisma.TimeLogUncheckedCreateInput>;
};
export type TimeLogCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TimeLogCreateManyInput | Prisma.TimeLogCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TimeLogUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeLogSelect<ExtArgs> | null;
    omit?: Prisma.TimeLogOmit<ExtArgs> | null;
    include?: Prisma.TimeLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TimeLogUpdateInput, Prisma.TimeLogUncheckedUpdateInput>;
    where: Prisma.TimeLogWhereUniqueInput;
};
export type TimeLogUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TimeLogUpdateManyMutationInput, Prisma.TimeLogUncheckedUpdateManyInput>;
    where?: Prisma.TimeLogWhereInput;
    limit?: number;
};
export type TimeLogUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeLogSelect<ExtArgs> | null;
    omit?: Prisma.TimeLogOmit<ExtArgs> | null;
    include?: Prisma.TimeLogInclude<ExtArgs> | null;
    where: Prisma.TimeLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.TimeLogCreateInput, Prisma.TimeLogUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TimeLogUpdateInput, Prisma.TimeLogUncheckedUpdateInput>;
};
export type TimeLogDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeLogSelect<ExtArgs> | null;
    omit?: Prisma.TimeLogOmit<ExtArgs> | null;
    include?: Prisma.TimeLogInclude<ExtArgs> | null;
    where: Prisma.TimeLogWhereUniqueInput;
};
export type TimeLogDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TimeLogWhereInput;
    limit?: number;
};
export type TimeLogDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeLogSelect<ExtArgs> | null;
    omit?: Prisma.TimeLogOmit<ExtArgs> | null;
    include?: Prisma.TimeLogInclude<ExtArgs> | null;
};
