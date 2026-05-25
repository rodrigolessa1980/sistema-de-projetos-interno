import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TaskDependencyModel = runtime.Types.Result.DefaultSelection<Prisma.$TaskDependencyPayload>;
export type AggregateTaskDependency = {
    _count: TaskDependencyCountAggregateOutputType | null;
    _min: TaskDependencyMinAggregateOutputType | null;
    _max: TaskDependencyMaxAggregateOutputType | null;
};
export type TaskDependencyMinAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    dependsOnTaskId: string | null;
    type: $Enums.DependencyType | null;
    createdAt: Date | null;
};
export type TaskDependencyMaxAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    dependsOnTaskId: string | null;
    type: $Enums.DependencyType | null;
    createdAt: Date | null;
};
export type TaskDependencyCountAggregateOutputType = {
    id: number;
    taskId: number;
    dependsOnTaskId: number;
    type: number;
    createdAt: number;
    _all: number;
};
export type TaskDependencyMinAggregateInputType = {
    id?: true;
    taskId?: true;
    dependsOnTaskId?: true;
    type?: true;
    createdAt?: true;
};
export type TaskDependencyMaxAggregateInputType = {
    id?: true;
    taskId?: true;
    dependsOnTaskId?: true;
    type?: true;
    createdAt?: true;
};
export type TaskDependencyCountAggregateInputType = {
    id?: true;
    taskId?: true;
    dependsOnTaskId?: true;
    type?: true;
    createdAt?: true;
    _all?: true;
};
export type TaskDependencyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskDependencyWhereInput;
    orderBy?: Prisma.TaskDependencyOrderByWithRelationInput | Prisma.TaskDependencyOrderByWithRelationInput[];
    cursor?: Prisma.TaskDependencyWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TaskDependencyCountAggregateInputType;
    _min?: TaskDependencyMinAggregateInputType;
    _max?: TaskDependencyMaxAggregateInputType;
};
export type GetTaskDependencyAggregateType<T extends TaskDependencyAggregateArgs> = {
    [P in keyof T & keyof AggregateTaskDependency]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTaskDependency[P]> : Prisma.GetScalarType<T[P], AggregateTaskDependency[P]>;
};
export type TaskDependencyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskDependencyWhereInput;
    orderBy?: Prisma.TaskDependencyOrderByWithAggregationInput | Prisma.TaskDependencyOrderByWithAggregationInput[];
    by: Prisma.TaskDependencyScalarFieldEnum[] | Prisma.TaskDependencyScalarFieldEnum;
    having?: Prisma.TaskDependencyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TaskDependencyCountAggregateInputType | true;
    _min?: TaskDependencyMinAggregateInputType;
    _max?: TaskDependencyMaxAggregateInputType;
};
export type TaskDependencyGroupByOutputType = {
    id: string;
    taskId: string;
    dependsOnTaskId: string;
    type: $Enums.DependencyType;
    createdAt: Date;
    _count: TaskDependencyCountAggregateOutputType | null;
    _min: TaskDependencyMinAggregateOutputType | null;
    _max: TaskDependencyMaxAggregateOutputType | null;
};
export type GetTaskDependencyGroupByPayload<T extends TaskDependencyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TaskDependencyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TaskDependencyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TaskDependencyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TaskDependencyGroupByOutputType[P]>;
}>>;
export type TaskDependencyWhereInput = {
    AND?: Prisma.TaskDependencyWhereInput | Prisma.TaskDependencyWhereInput[];
    OR?: Prisma.TaskDependencyWhereInput[];
    NOT?: Prisma.TaskDependencyWhereInput | Prisma.TaskDependencyWhereInput[];
    id?: Prisma.StringFilter<"TaskDependency"> | string;
    taskId?: Prisma.StringFilter<"TaskDependency"> | string;
    dependsOnTaskId?: Prisma.StringFilter<"TaskDependency"> | string;
    type?: Prisma.EnumDependencyTypeFilter<"TaskDependency"> | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeFilter<"TaskDependency"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    dependsOnTask?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
};
export type TaskDependencyOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    dependsOnTaskId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    task?: Prisma.TaskOrderByWithRelationInput;
    dependsOnTask?: Prisma.TaskOrderByWithRelationInput;
    _relevance?: Prisma.TaskDependencyOrderByRelevanceInput;
};
export type TaskDependencyWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    taskId_dependsOnTaskId?: Prisma.TaskDependencyTaskIdDependsOnTaskIdCompoundUniqueInput;
    AND?: Prisma.TaskDependencyWhereInput | Prisma.TaskDependencyWhereInput[];
    OR?: Prisma.TaskDependencyWhereInput[];
    NOT?: Prisma.TaskDependencyWhereInput | Prisma.TaskDependencyWhereInput[];
    taskId?: Prisma.StringFilter<"TaskDependency"> | string;
    dependsOnTaskId?: Prisma.StringFilter<"TaskDependency"> | string;
    type?: Prisma.EnumDependencyTypeFilter<"TaskDependency"> | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeFilter<"TaskDependency"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    dependsOnTask?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
}, "id" | "taskId_dependsOnTaskId">;
export type TaskDependencyOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    dependsOnTaskId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.TaskDependencyCountOrderByAggregateInput;
    _max?: Prisma.TaskDependencyMaxOrderByAggregateInput;
    _min?: Prisma.TaskDependencyMinOrderByAggregateInput;
};
export type TaskDependencyScalarWhereWithAggregatesInput = {
    AND?: Prisma.TaskDependencyScalarWhereWithAggregatesInput | Prisma.TaskDependencyScalarWhereWithAggregatesInput[];
    OR?: Prisma.TaskDependencyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TaskDependencyScalarWhereWithAggregatesInput | Prisma.TaskDependencyScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"TaskDependency"> | string;
    taskId?: Prisma.StringWithAggregatesFilter<"TaskDependency"> | string;
    dependsOnTaskId?: Prisma.StringWithAggregatesFilter<"TaskDependency"> | string;
    type?: Prisma.EnumDependencyTypeWithAggregatesFilter<"TaskDependency"> | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"TaskDependency"> | Date | string;
};
export type TaskDependencyCreateInput = {
    id?: string;
    type?: $Enums.DependencyType;
    createdAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutDependenciesInput;
    dependsOnTask: Prisma.TaskCreateNestedOneWithoutDependencyOfInput;
};
export type TaskDependencyUncheckedCreateInput = {
    id?: string;
    taskId: string;
    dependsOnTaskId: string;
    type?: $Enums.DependencyType;
    createdAt?: Date | string;
};
export type TaskDependencyUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumDependencyTypeFieldUpdateOperationsInput | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutDependenciesNestedInput;
    dependsOnTask?: Prisma.TaskUpdateOneRequiredWithoutDependencyOfNestedInput;
};
export type TaskDependencyUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    dependsOnTaskId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumDependencyTypeFieldUpdateOperationsInput | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskDependencyCreateManyInput = {
    id?: string;
    taskId: string;
    dependsOnTaskId: string;
    type?: $Enums.DependencyType;
    createdAt?: Date | string;
};
export type TaskDependencyUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumDependencyTypeFieldUpdateOperationsInput | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskDependencyUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    dependsOnTaskId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumDependencyTypeFieldUpdateOperationsInput | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskDependencyListRelationFilter = {
    every?: Prisma.TaskDependencyWhereInput;
    some?: Prisma.TaskDependencyWhereInput;
    none?: Prisma.TaskDependencyWhereInput;
};
export type TaskDependencyOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TaskDependencyOrderByRelevanceInput = {
    fields: Prisma.TaskDependencyOrderByRelevanceFieldEnum | Prisma.TaskDependencyOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type TaskDependencyTaskIdDependsOnTaskIdCompoundUniqueInput = {
    taskId: string;
    dependsOnTaskId: string;
};
export type TaskDependencyCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    dependsOnTaskId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TaskDependencyMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    dependsOnTaskId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TaskDependencyMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    dependsOnTaskId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TaskDependencyCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TaskDependencyCreateWithoutTaskInput, Prisma.TaskDependencyUncheckedCreateWithoutTaskInput> | Prisma.TaskDependencyCreateWithoutTaskInput[] | Prisma.TaskDependencyUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskDependencyCreateOrConnectWithoutTaskInput | Prisma.TaskDependencyCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TaskDependencyCreateManyTaskInputEnvelope;
    connect?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
};
export type TaskDependencyCreateNestedManyWithoutDependsOnTaskInput = {
    create?: Prisma.XOR<Prisma.TaskDependencyCreateWithoutDependsOnTaskInput, Prisma.TaskDependencyUncheckedCreateWithoutDependsOnTaskInput> | Prisma.TaskDependencyCreateWithoutDependsOnTaskInput[] | Prisma.TaskDependencyUncheckedCreateWithoutDependsOnTaskInput[];
    connectOrCreate?: Prisma.TaskDependencyCreateOrConnectWithoutDependsOnTaskInput | Prisma.TaskDependencyCreateOrConnectWithoutDependsOnTaskInput[];
    createMany?: Prisma.TaskDependencyCreateManyDependsOnTaskInputEnvelope;
    connect?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
};
export type TaskDependencyUncheckedCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TaskDependencyCreateWithoutTaskInput, Prisma.TaskDependencyUncheckedCreateWithoutTaskInput> | Prisma.TaskDependencyCreateWithoutTaskInput[] | Prisma.TaskDependencyUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskDependencyCreateOrConnectWithoutTaskInput | Prisma.TaskDependencyCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TaskDependencyCreateManyTaskInputEnvelope;
    connect?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
};
export type TaskDependencyUncheckedCreateNestedManyWithoutDependsOnTaskInput = {
    create?: Prisma.XOR<Prisma.TaskDependencyCreateWithoutDependsOnTaskInput, Prisma.TaskDependencyUncheckedCreateWithoutDependsOnTaskInput> | Prisma.TaskDependencyCreateWithoutDependsOnTaskInput[] | Prisma.TaskDependencyUncheckedCreateWithoutDependsOnTaskInput[];
    connectOrCreate?: Prisma.TaskDependencyCreateOrConnectWithoutDependsOnTaskInput | Prisma.TaskDependencyCreateOrConnectWithoutDependsOnTaskInput[];
    createMany?: Prisma.TaskDependencyCreateManyDependsOnTaskInputEnvelope;
    connect?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
};
export type TaskDependencyUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TaskDependencyCreateWithoutTaskInput, Prisma.TaskDependencyUncheckedCreateWithoutTaskInput> | Prisma.TaskDependencyCreateWithoutTaskInput[] | Prisma.TaskDependencyUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskDependencyCreateOrConnectWithoutTaskInput | Prisma.TaskDependencyCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TaskDependencyUpsertWithWhereUniqueWithoutTaskInput | Prisma.TaskDependencyUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TaskDependencyCreateManyTaskInputEnvelope;
    set?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    disconnect?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    delete?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    connect?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    update?: Prisma.TaskDependencyUpdateWithWhereUniqueWithoutTaskInput | Prisma.TaskDependencyUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TaskDependencyUpdateManyWithWhereWithoutTaskInput | Prisma.TaskDependencyUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TaskDependencyScalarWhereInput | Prisma.TaskDependencyScalarWhereInput[];
};
export type TaskDependencyUpdateManyWithoutDependsOnTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TaskDependencyCreateWithoutDependsOnTaskInput, Prisma.TaskDependencyUncheckedCreateWithoutDependsOnTaskInput> | Prisma.TaskDependencyCreateWithoutDependsOnTaskInput[] | Prisma.TaskDependencyUncheckedCreateWithoutDependsOnTaskInput[];
    connectOrCreate?: Prisma.TaskDependencyCreateOrConnectWithoutDependsOnTaskInput | Prisma.TaskDependencyCreateOrConnectWithoutDependsOnTaskInput[];
    upsert?: Prisma.TaskDependencyUpsertWithWhereUniqueWithoutDependsOnTaskInput | Prisma.TaskDependencyUpsertWithWhereUniqueWithoutDependsOnTaskInput[];
    createMany?: Prisma.TaskDependencyCreateManyDependsOnTaskInputEnvelope;
    set?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    disconnect?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    delete?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    connect?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    update?: Prisma.TaskDependencyUpdateWithWhereUniqueWithoutDependsOnTaskInput | Prisma.TaskDependencyUpdateWithWhereUniqueWithoutDependsOnTaskInput[];
    updateMany?: Prisma.TaskDependencyUpdateManyWithWhereWithoutDependsOnTaskInput | Prisma.TaskDependencyUpdateManyWithWhereWithoutDependsOnTaskInput[];
    deleteMany?: Prisma.TaskDependencyScalarWhereInput | Prisma.TaskDependencyScalarWhereInput[];
};
export type TaskDependencyUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TaskDependencyCreateWithoutTaskInput, Prisma.TaskDependencyUncheckedCreateWithoutTaskInput> | Prisma.TaskDependencyCreateWithoutTaskInput[] | Prisma.TaskDependencyUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskDependencyCreateOrConnectWithoutTaskInput | Prisma.TaskDependencyCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TaskDependencyUpsertWithWhereUniqueWithoutTaskInput | Prisma.TaskDependencyUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TaskDependencyCreateManyTaskInputEnvelope;
    set?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    disconnect?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    delete?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    connect?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    update?: Prisma.TaskDependencyUpdateWithWhereUniqueWithoutTaskInput | Prisma.TaskDependencyUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TaskDependencyUpdateManyWithWhereWithoutTaskInput | Prisma.TaskDependencyUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TaskDependencyScalarWhereInput | Prisma.TaskDependencyScalarWhereInput[];
};
export type TaskDependencyUncheckedUpdateManyWithoutDependsOnTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TaskDependencyCreateWithoutDependsOnTaskInput, Prisma.TaskDependencyUncheckedCreateWithoutDependsOnTaskInput> | Prisma.TaskDependencyCreateWithoutDependsOnTaskInput[] | Prisma.TaskDependencyUncheckedCreateWithoutDependsOnTaskInput[];
    connectOrCreate?: Prisma.TaskDependencyCreateOrConnectWithoutDependsOnTaskInput | Prisma.TaskDependencyCreateOrConnectWithoutDependsOnTaskInput[];
    upsert?: Prisma.TaskDependencyUpsertWithWhereUniqueWithoutDependsOnTaskInput | Prisma.TaskDependencyUpsertWithWhereUniqueWithoutDependsOnTaskInput[];
    createMany?: Prisma.TaskDependencyCreateManyDependsOnTaskInputEnvelope;
    set?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    disconnect?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    delete?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    connect?: Prisma.TaskDependencyWhereUniqueInput | Prisma.TaskDependencyWhereUniqueInput[];
    update?: Prisma.TaskDependencyUpdateWithWhereUniqueWithoutDependsOnTaskInput | Prisma.TaskDependencyUpdateWithWhereUniqueWithoutDependsOnTaskInput[];
    updateMany?: Prisma.TaskDependencyUpdateManyWithWhereWithoutDependsOnTaskInput | Prisma.TaskDependencyUpdateManyWithWhereWithoutDependsOnTaskInput[];
    deleteMany?: Prisma.TaskDependencyScalarWhereInput | Prisma.TaskDependencyScalarWhereInput[];
};
export type EnumDependencyTypeFieldUpdateOperationsInput = {
    set?: $Enums.DependencyType;
};
export type TaskDependencyCreateWithoutTaskInput = {
    id?: string;
    type?: $Enums.DependencyType;
    createdAt?: Date | string;
    dependsOnTask: Prisma.TaskCreateNestedOneWithoutDependencyOfInput;
};
export type TaskDependencyUncheckedCreateWithoutTaskInput = {
    id?: string;
    dependsOnTaskId: string;
    type?: $Enums.DependencyType;
    createdAt?: Date | string;
};
export type TaskDependencyCreateOrConnectWithoutTaskInput = {
    where: Prisma.TaskDependencyWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskDependencyCreateWithoutTaskInput, Prisma.TaskDependencyUncheckedCreateWithoutTaskInput>;
};
export type TaskDependencyCreateManyTaskInputEnvelope = {
    data: Prisma.TaskDependencyCreateManyTaskInput | Prisma.TaskDependencyCreateManyTaskInput[];
    skipDuplicates?: boolean;
};
export type TaskDependencyCreateWithoutDependsOnTaskInput = {
    id?: string;
    type?: $Enums.DependencyType;
    createdAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutDependenciesInput;
};
export type TaskDependencyUncheckedCreateWithoutDependsOnTaskInput = {
    id?: string;
    taskId: string;
    type?: $Enums.DependencyType;
    createdAt?: Date | string;
};
export type TaskDependencyCreateOrConnectWithoutDependsOnTaskInput = {
    where: Prisma.TaskDependencyWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskDependencyCreateWithoutDependsOnTaskInput, Prisma.TaskDependencyUncheckedCreateWithoutDependsOnTaskInput>;
};
export type TaskDependencyCreateManyDependsOnTaskInputEnvelope = {
    data: Prisma.TaskDependencyCreateManyDependsOnTaskInput | Prisma.TaskDependencyCreateManyDependsOnTaskInput[];
    skipDuplicates?: boolean;
};
export type TaskDependencyUpsertWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TaskDependencyWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskDependencyUpdateWithoutTaskInput, Prisma.TaskDependencyUncheckedUpdateWithoutTaskInput>;
    create: Prisma.XOR<Prisma.TaskDependencyCreateWithoutTaskInput, Prisma.TaskDependencyUncheckedCreateWithoutTaskInput>;
};
export type TaskDependencyUpdateWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TaskDependencyWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskDependencyUpdateWithoutTaskInput, Prisma.TaskDependencyUncheckedUpdateWithoutTaskInput>;
};
export type TaskDependencyUpdateManyWithWhereWithoutTaskInput = {
    where: Prisma.TaskDependencyScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskDependencyUpdateManyMutationInput, Prisma.TaskDependencyUncheckedUpdateManyWithoutTaskInput>;
};
export type TaskDependencyScalarWhereInput = {
    AND?: Prisma.TaskDependencyScalarWhereInput | Prisma.TaskDependencyScalarWhereInput[];
    OR?: Prisma.TaskDependencyScalarWhereInput[];
    NOT?: Prisma.TaskDependencyScalarWhereInput | Prisma.TaskDependencyScalarWhereInput[];
    id?: Prisma.StringFilter<"TaskDependency"> | string;
    taskId?: Prisma.StringFilter<"TaskDependency"> | string;
    dependsOnTaskId?: Prisma.StringFilter<"TaskDependency"> | string;
    type?: Prisma.EnumDependencyTypeFilter<"TaskDependency"> | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeFilter<"TaskDependency"> | Date | string;
};
export type TaskDependencyUpsertWithWhereUniqueWithoutDependsOnTaskInput = {
    where: Prisma.TaskDependencyWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskDependencyUpdateWithoutDependsOnTaskInput, Prisma.TaskDependencyUncheckedUpdateWithoutDependsOnTaskInput>;
    create: Prisma.XOR<Prisma.TaskDependencyCreateWithoutDependsOnTaskInput, Prisma.TaskDependencyUncheckedCreateWithoutDependsOnTaskInput>;
};
export type TaskDependencyUpdateWithWhereUniqueWithoutDependsOnTaskInput = {
    where: Prisma.TaskDependencyWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskDependencyUpdateWithoutDependsOnTaskInput, Prisma.TaskDependencyUncheckedUpdateWithoutDependsOnTaskInput>;
};
export type TaskDependencyUpdateManyWithWhereWithoutDependsOnTaskInput = {
    where: Prisma.TaskDependencyScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskDependencyUpdateManyMutationInput, Prisma.TaskDependencyUncheckedUpdateManyWithoutDependsOnTaskInput>;
};
export type TaskDependencyCreateManyTaskInput = {
    id?: string;
    dependsOnTaskId: string;
    type?: $Enums.DependencyType;
    createdAt?: Date | string;
};
export type TaskDependencyCreateManyDependsOnTaskInput = {
    id?: string;
    taskId: string;
    type?: $Enums.DependencyType;
    createdAt?: Date | string;
};
export type TaskDependencyUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumDependencyTypeFieldUpdateOperationsInput | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dependsOnTask?: Prisma.TaskUpdateOneRequiredWithoutDependencyOfNestedInput;
};
export type TaskDependencyUncheckedUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dependsOnTaskId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumDependencyTypeFieldUpdateOperationsInput | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskDependencyUncheckedUpdateManyWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dependsOnTaskId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumDependencyTypeFieldUpdateOperationsInput | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskDependencyUpdateWithoutDependsOnTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumDependencyTypeFieldUpdateOperationsInput | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutDependenciesNestedInput;
};
export type TaskDependencyUncheckedUpdateWithoutDependsOnTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumDependencyTypeFieldUpdateOperationsInput | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskDependencyUncheckedUpdateManyWithoutDependsOnTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumDependencyTypeFieldUpdateOperationsInput | $Enums.DependencyType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskDependencySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    dependsOnTaskId?: boolean;
    type?: boolean;
    createdAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    dependsOnTask?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["taskDependency"]>;
export type TaskDependencySelectScalar = {
    id?: boolean;
    taskId?: boolean;
    dependsOnTaskId?: boolean;
    type?: boolean;
    createdAt?: boolean;
};
export type TaskDependencyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "taskId" | "dependsOnTaskId" | "type" | "createdAt", ExtArgs["result"]["taskDependency"]>;
export type TaskDependencyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    dependsOnTask?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
};
export type $TaskDependencyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TaskDependency";
    objects: {
        task: Prisma.$TaskPayload<ExtArgs>;
        dependsOnTask: Prisma.$TaskPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        taskId: string;
        dependsOnTaskId: string;
        type: $Enums.DependencyType;
        createdAt: Date;
    }, ExtArgs["result"]["taskDependency"]>;
    composites: {};
};
export type TaskDependencyGetPayload<S extends boolean | null | undefined | TaskDependencyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TaskDependencyPayload, S>;
export type TaskDependencyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TaskDependencyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TaskDependencyCountAggregateInputType | true;
};
export interface TaskDependencyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TaskDependency'];
        meta: {
            name: 'TaskDependency';
        };
    };
    findUnique<T extends TaskDependencyFindUniqueArgs>(args: Prisma.SelectSubset<T, TaskDependencyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TaskDependencyClient<runtime.Types.Result.GetResult<Prisma.$TaskDependencyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TaskDependencyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TaskDependencyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskDependencyClient<runtime.Types.Result.GetResult<Prisma.$TaskDependencyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TaskDependencyFindFirstArgs>(args?: Prisma.SelectSubset<T, TaskDependencyFindFirstArgs<ExtArgs>>): Prisma.Prisma__TaskDependencyClient<runtime.Types.Result.GetResult<Prisma.$TaskDependencyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TaskDependencyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TaskDependencyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskDependencyClient<runtime.Types.Result.GetResult<Prisma.$TaskDependencyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TaskDependencyFindManyArgs>(args?: Prisma.SelectSubset<T, TaskDependencyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskDependencyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TaskDependencyCreateArgs>(args: Prisma.SelectSubset<T, TaskDependencyCreateArgs<ExtArgs>>): Prisma.Prisma__TaskDependencyClient<runtime.Types.Result.GetResult<Prisma.$TaskDependencyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TaskDependencyCreateManyArgs>(args?: Prisma.SelectSubset<T, TaskDependencyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends TaskDependencyDeleteArgs>(args: Prisma.SelectSubset<T, TaskDependencyDeleteArgs<ExtArgs>>): Prisma.Prisma__TaskDependencyClient<runtime.Types.Result.GetResult<Prisma.$TaskDependencyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TaskDependencyUpdateArgs>(args: Prisma.SelectSubset<T, TaskDependencyUpdateArgs<ExtArgs>>): Prisma.Prisma__TaskDependencyClient<runtime.Types.Result.GetResult<Prisma.$TaskDependencyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TaskDependencyDeleteManyArgs>(args?: Prisma.SelectSubset<T, TaskDependencyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TaskDependencyUpdateManyArgs>(args: Prisma.SelectSubset<T, TaskDependencyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends TaskDependencyUpsertArgs>(args: Prisma.SelectSubset<T, TaskDependencyUpsertArgs<ExtArgs>>): Prisma.Prisma__TaskDependencyClient<runtime.Types.Result.GetResult<Prisma.$TaskDependencyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TaskDependencyCountArgs>(args?: Prisma.Subset<T, TaskDependencyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TaskDependencyCountAggregateOutputType> : number>;
    aggregate<T extends TaskDependencyAggregateArgs>(args: Prisma.Subset<T, TaskDependencyAggregateArgs>): Prisma.PrismaPromise<GetTaskDependencyAggregateType<T>>;
    groupBy<T extends TaskDependencyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TaskDependencyGroupByArgs['orderBy'];
    } : {
        orderBy?: TaskDependencyGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TaskDependencyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskDependencyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TaskDependencyFieldRefs;
}
export interface Prisma__TaskDependencyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    task<T extends Prisma.TaskDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskDefaultArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    dependsOnTask<T extends Prisma.TaskDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskDefaultArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TaskDependencyFieldRefs {
    readonly id: Prisma.FieldRef<"TaskDependency", 'String'>;
    readonly taskId: Prisma.FieldRef<"TaskDependency", 'String'>;
    readonly dependsOnTaskId: Prisma.FieldRef<"TaskDependency", 'String'>;
    readonly type: Prisma.FieldRef<"TaskDependency", 'DependencyType'>;
    readonly createdAt: Prisma.FieldRef<"TaskDependency", 'DateTime'>;
}
export type TaskDependencyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskDependencySelect<ExtArgs> | null;
    omit?: Prisma.TaskDependencyOmit<ExtArgs> | null;
    include?: Prisma.TaskDependencyInclude<ExtArgs> | null;
    where: Prisma.TaskDependencyWhereUniqueInput;
};
export type TaskDependencyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskDependencySelect<ExtArgs> | null;
    omit?: Prisma.TaskDependencyOmit<ExtArgs> | null;
    include?: Prisma.TaskDependencyInclude<ExtArgs> | null;
    where: Prisma.TaskDependencyWhereUniqueInput;
};
export type TaskDependencyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskDependencySelect<ExtArgs> | null;
    omit?: Prisma.TaskDependencyOmit<ExtArgs> | null;
    include?: Prisma.TaskDependencyInclude<ExtArgs> | null;
    where?: Prisma.TaskDependencyWhereInput;
    orderBy?: Prisma.TaskDependencyOrderByWithRelationInput | Prisma.TaskDependencyOrderByWithRelationInput[];
    cursor?: Prisma.TaskDependencyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskDependencyScalarFieldEnum | Prisma.TaskDependencyScalarFieldEnum[];
};
export type TaskDependencyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskDependencySelect<ExtArgs> | null;
    omit?: Prisma.TaskDependencyOmit<ExtArgs> | null;
    include?: Prisma.TaskDependencyInclude<ExtArgs> | null;
    where?: Prisma.TaskDependencyWhereInput;
    orderBy?: Prisma.TaskDependencyOrderByWithRelationInput | Prisma.TaskDependencyOrderByWithRelationInput[];
    cursor?: Prisma.TaskDependencyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskDependencyScalarFieldEnum | Prisma.TaskDependencyScalarFieldEnum[];
};
export type TaskDependencyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskDependencySelect<ExtArgs> | null;
    omit?: Prisma.TaskDependencyOmit<ExtArgs> | null;
    include?: Prisma.TaskDependencyInclude<ExtArgs> | null;
    where?: Prisma.TaskDependencyWhereInput;
    orderBy?: Prisma.TaskDependencyOrderByWithRelationInput | Prisma.TaskDependencyOrderByWithRelationInput[];
    cursor?: Prisma.TaskDependencyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskDependencyScalarFieldEnum | Prisma.TaskDependencyScalarFieldEnum[];
};
export type TaskDependencyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskDependencySelect<ExtArgs> | null;
    omit?: Prisma.TaskDependencyOmit<ExtArgs> | null;
    include?: Prisma.TaskDependencyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskDependencyCreateInput, Prisma.TaskDependencyUncheckedCreateInput>;
};
export type TaskDependencyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TaskDependencyCreateManyInput | Prisma.TaskDependencyCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TaskDependencyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskDependencySelect<ExtArgs> | null;
    omit?: Prisma.TaskDependencyOmit<ExtArgs> | null;
    include?: Prisma.TaskDependencyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskDependencyUpdateInput, Prisma.TaskDependencyUncheckedUpdateInput>;
    where: Prisma.TaskDependencyWhereUniqueInput;
};
export type TaskDependencyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TaskDependencyUpdateManyMutationInput, Prisma.TaskDependencyUncheckedUpdateManyInput>;
    where?: Prisma.TaskDependencyWhereInput;
    limit?: number;
};
export type TaskDependencyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskDependencySelect<ExtArgs> | null;
    omit?: Prisma.TaskDependencyOmit<ExtArgs> | null;
    include?: Prisma.TaskDependencyInclude<ExtArgs> | null;
    where: Prisma.TaskDependencyWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskDependencyCreateInput, Prisma.TaskDependencyUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TaskDependencyUpdateInput, Prisma.TaskDependencyUncheckedUpdateInput>;
};
export type TaskDependencyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskDependencySelect<ExtArgs> | null;
    omit?: Prisma.TaskDependencyOmit<ExtArgs> | null;
    include?: Prisma.TaskDependencyInclude<ExtArgs> | null;
    where: Prisma.TaskDependencyWhereUniqueInput;
};
export type TaskDependencyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskDependencyWhereInput;
    limit?: number;
};
export type TaskDependencyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskDependencySelect<ExtArgs> | null;
    omit?: Prisma.TaskDependencyOmit<ExtArgs> | null;
    include?: Prisma.TaskDependencyInclude<ExtArgs> | null;
};
