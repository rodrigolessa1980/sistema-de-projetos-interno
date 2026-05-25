import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SubtaskModel = runtime.Types.Result.DefaultSelection<Prisma.$SubtaskPayload>;
export type AggregateSubtask = {
    _count: SubtaskCountAggregateOutputType | null;
    _min: SubtaskMinAggregateOutputType | null;
    _max: SubtaskMaxAggregateOutputType | null;
};
export type SubtaskMinAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    title: string | null;
    completed: boolean | null;
    assigneeId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SubtaskMaxAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    title: string | null;
    completed: boolean | null;
    assigneeId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SubtaskCountAggregateOutputType = {
    id: number;
    taskId: number;
    title: number;
    completed: number;
    assigneeId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type SubtaskMinAggregateInputType = {
    id?: true;
    taskId?: true;
    title?: true;
    completed?: true;
    assigneeId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SubtaskMaxAggregateInputType = {
    id?: true;
    taskId?: true;
    title?: true;
    completed?: true;
    assigneeId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SubtaskCountAggregateInputType = {
    id?: true;
    taskId?: true;
    title?: true;
    completed?: true;
    assigneeId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type SubtaskAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubtaskWhereInput;
    orderBy?: Prisma.SubtaskOrderByWithRelationInput | Prisma.SubtaskOrderByWithRelationInput[];
    cursor?: Prisma.SubtaskWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SubtaskCountAggregateInputType;
    _min?: SubtaskMinAggregateInputType;
    _max?: SubtaskMaxAggregateInputType;
};
export type GetSubtaskAggregateType<T extends SubtaskAggregateArgs> = {
    [P in keyof T & keyof AggregateSubtask]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSubtask[P]> : Prisma.GetScalarType<T[P], AggregateSubtask[P]>;
};
export type SubtaskGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubtaskWhereInput;
    orderBy?: Prisma.SubtaskOrderByWithAggregationInput | Prisma.SubtaskOrderByWithAggregationInput[];
    by: Prisma.SubtaskScalarFieldEnum[] | Prisma.SubtaskScalarFieldEnum;
    having?: Prisma.SubtaskScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubtaskCountAggregateInputType | true;
    _min?: SubtaskMinAggregateInputType;
    _max?: SubtaskMaxAggregateInputType;
};
export type SubtaskGroupByOutputType = {
    id: string;
    taskId: string;
    title: string;
    completed: boolean;
    assigneeId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: SubtaskCountAggregateOutputType | null;
    _min: SubtaskMinAggregateOutputType | null;
    _max: SubtaskMaxAggregateOutputType | null;
};
export type GetSubtaskGroupByPayload<T extends SubtaskGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SubtaskGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SubtaskGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SubtaskGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SubtaskGroupByOutputType[P]>;
}>>;
export type SubtaskWhereInput = {
    AND?: Prisma.SubtaskWhereInput | Prisma.SubtaskWhereInput[];
    OR?: Prisma.SubtaskWhereInput[];
    NOT?: Prisma.SubtaskWhereInput | Prisma.SubtaskWhereInput[];
    id?: Prisma.StringFilter<"Subtask"> | string;
    taskId?: Prisma.StringFilter<"Subtask"> | string;
    title?: Prisma.StringFilter<"Subtask"> | string;
    completed?: Prisma.BoolFilter<"Subtask"> | boolean;
    assigneeId?: Prisma.StringNullableFilter<"Subtask"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Subtask"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Subtask"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    assignee?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type SubtaskOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    completed?: Prisma.SortOrder;
    assigneeId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    task?: Prisma.TaskOrderByWithRelationInput;
    assignee?: Prisma.UserOrderByWithRelationInput;
    _relevance?: Prisma.SubtaskOrderByRelevanceInput;
};
export type SubtaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SubtaskWhereInput | Prisma.SubtaskWhereInput[];
    OR?: Prisma.SubtaskWhereInput[];
    NOT?: Prisma.SubtaskWhereInput | Prisma.SubtaskWhereInput[];
    taskId?: Prisma.StringFilter<"Subtask"> | string;
    title?: Prisma.StringFilter<"Subtask"> | string;
    completed?: Prisma.BoolFilter<"Subtask"> | boolean;
    assigneeId?: Prisma.StringNullableFilter<"Subtask"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Subtask"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Subtask"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    assignee?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type SubtaskOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    completed?: Prisma.SortOrder;
    assigneeId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.SubtaskCountOrderByAggregateInput;
    _max?: Prisma.SubtaskMaxOrderByAggregateInput;
    _min?: Prisma.SubtaskMinOrderByAggregateInput;
};
export type SubtaskScalarWhereWithAggregatesInput = {
    AND?: Prisma.SubtaskScalarWhereWithAggregatesInput | Prisma.SubtaskScalarWhereWithAggregatesInput[];
    OR?: Prisma.SubtaskScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SubtaskScalarWhereWithAggregatesInput | Prisma.SubtaskScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Subtask"> | string;
    taskId?: Prisma.StringWithAggregatesFilter<"Subtask"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Subtask"> | string;
    completed?: Prisma.BoolWithAggregatesFilter<"Subtask"> | boolean;
    assigneeId?: Prisma.StringNullableWithAggregatesFilter<"Subtask"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Subtask"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Subtask"> | Date | string;
};
export type SubtaskCreateInput = {
    id?: string;
    title: string;
    completed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutSubtasksInput;
    assignee?: Prisma.UserCreateNestedOneWithoutSubtasksInput;
};
export type SubtaskUncheckedCreateInput = {
    id?: string;
    taskId: string;
    title: string;
    completed?: boolean;
    assigneeId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubtaskUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutSubtasksNestedInput;
    assignee?: Prisma.UserUpdateOneWithoutSubtasksNestedInput;
};
export type SubtaskUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assigneeId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubtaskCreateManyInput = {
    id?: string;
    taskId: string;
    title: string;
    completed?: boolean;
    assigneeId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubtaskUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubtaskUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assigneeId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubtaskListRelationFilter = {
    every?: Prisma.SubtaskWhereInput;
    some?: Prisma.SubtaskWhereInput;
    none?: Prisma.SubtaskWhereInput;
};
export type SubtaskOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SubtaskOrderByRelevanceInput = {
    fields: Prisma.SubtaskOrderByRelevanceFieldEnum | Prisma.SubtaskOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type SubtaskCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    completed?: Prisma.SortOrder;
    assigneeId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubtaskMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    completed?: Prisma.SortOrder;
    assigneeId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubtaskMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    completed?: Prisma.SortOrder;
    assigneeId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubtaskCreateNestedManyWithoutAssigneeInput = {
    create?: Prisma.XOR<Prisma.SubtaskCreateWithoutAssigneeInput, Prisma.SubtaskUncheckedCreateWithoutAssigneeInput> | Prisma.SubtaskCreateWithoutAssigneeInput[] | Prisma.SubtaskUncheckedCreateWithoutAssigneeInput[];
    connectOrCreate?: Prisma.SubtaskCreateOrConnectWithoutAssigneeInput | Prisma.SubtaskCreateOrConnectWithoutAssigneeInput[];
    createMany?: Prisma.SubtaskCreateManyAssigneeInputEnvelope;
    connect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
};
export type SubtaskUncheckedCreateNestedManyWithoutAssigneeInput = {
    create?: Prisma.XOR<Prisma.SubtaskCreateWithoutAssigneeInput, Prisma.SubtaskUncheckedCreateWithoutAssigneeInput> | Prisma.SubtaskCreateWithoutAssigneeInput[] | Prisma.SubtaskUncheckedCreateWithoutAssigneeInput[];
    connectOrCreate?: Prisma.SubtaskCreateOrConnectWithoutAssigneeInput | Prisma.SubtaskCreateOrConnectWithoutAssigneeInput[];
    createMany?: Prisma.SubtaskCreateManyAssigneeInputEnvelope;
    connect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
};
export type SubtaskUpdateManyWithoutAssigneeNestedInput = {
    create?: Prisma.XOR<Prisma.SubtaskCreateWithoutAssigneeInput, Prisma.SubtaskUncheckedCreateWithoutAssigneeInput> | Prisma.SubtaskCreateWithoutAssigneeInput[] | Prisma.SubtaskUncheckedCreateWithoutAssigneeInput[];
    connectOrCreate?: Prisma.SubtaskCreateOrConnectWithoutAssigneeInput | Prisma.SubtaskCreateOrConnectWithoutAssigneeInput[];
    upsert?: Prisma.SubtaskUpsertWithWhereUniqueWithoutAssigneeInput | Prisma.SubtaskUpsertWithWhereUniqueWithoutAssigneeInput[];
    createMany?: Prisma.SubtaskCreateManyAssigneeInputEnvelope;
    set?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    disconnect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    delete?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    connect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    update?: Prisma.SubtaskUpdateWithWhereUniqueWithoutAssigneeInput | Prisma.SubtaskUpdateWithWhereUniqueWithoutAssigneeInput[];
    updateMany?: Prisma.SubtaskUpdateManyWithWhereWithoutAssigneeInput | Prisma.SubtaskUpdateManyWithWhereWithoutAssigneeInput[];
    deleteMany?: Prisma.SubtaskScalarWhereInput | Prisma.SubtaskScalarWhereInput[];
};
export type SubtaskUncheckedUpdateManyWithoutAssigneeNestedInput = {
    create?: Prisma.XOR<Prisma.SubtaskCreateWithoutAssigneeInput, Prisma.SubtaskUncheckedCreateWithoutAssigneeInput> | Prisma.SubtaskCreateWithoutAssigneeInput[] | Prisma.SubtaskUncheckedCreateWithoutAssigneeInput[];
    connectOrCreate?: Prisma.SubtaskCreateOrConnectWithoutAssigneeInput | Prisma.SubtaskCreateOrConnectWithoutAssigneeInput[];
    upsert?: Prisma.SubtaskUpsertWithWhereUniqueWithoutAssigneeInput | Prisma.SubtaskUpsertWithWhereUniqueWithoutAssigneeInput[];
    createMany?: Prisma.SubtaskCreateManyAssigneeInputEnvelope;
    set?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    disconnect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    delete?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    connect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    update?: Prisma.SubtaskUpdateWithWhereUniqueWithoutAssigneeInput | Prisma.SubtaskUpdateWithWhereUniqueWithoutAssigneeInput[];
    updateMany?: Prisma.SubtaskUpdateManyWithWhereWithoutAssigneeInput | Prisma.SubtaskUpdateManyWithWhereWithoutAssigneeInput[];
    deleteMany?: Prisma.SubtaskScalarWhereInput | Prisma.SubtaskScalarWhereInput[];
};
export type SubtaskCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.SubtaskCreateWithoutTaskInput, Prisma.SubtaskUncheckedCreateWithoutTaskInput> | Prisma.SubtaskCreateWithoutTaskInput[] | Prisma.SubtaskUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.SubtaskCreateOrConnectWithoutTaskInput | Prisma.SubtaskCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.SubtaskCreateManyTaskInputEnvelope;
    connect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
};
export type SubtaskUncheckedCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.SubtaskCreateWithoutTaskInput, Prisma.SubtaskUncheckedCreateWithoutTaskInput> | Prisma.SubtaskCreateWithoutTaskInput[] | Prisma.SubtaskUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.SubtaskCreateOrConnectWithoutTaskInput | Prisma.SubtaskCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.SubtaskCreateManyTaskInputEnvelope;
    connect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
};
export type SubtaskUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.SubtaskCreateWithoutTaskInput, Prisma.SubtaskUncheckedCreateWithoutTaskInput> | Prisma.SubtaskCreateWithoutTaskInput[] | Prisma.SubtaskUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.SubtaskCreateOrConnectWithoutTaskInput | Prisma.SubtaskCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.SubtaskUpsertWithWhereUniqueWithoutTaskInput | Prisma.SubtaskUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.SubtaskCreateManyTaskInputEnvelope;
    set?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    disconnect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    delete?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    connect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    update?: Prisma.SubtaskUpdateWithWhereUniqueWithoutTaskInput | Prisma.SubtaskUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.SubtaskUpdateManyWithWhereWithoutTaskInput | Prisma.SubtaskUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.SubtaskScalarWhereInput | Prisma.SubtaskScalarWhereInput[];
};
export type SubtaskUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.SubtaskCreateWithoutTaskInput, Prisma.SubtaskUncheckedCreateWithoutTaskInput> | Prisma.SubtaskCreateWithoutTaskInput[] | Prisma.SubtaskUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.SubtaskCreateOrConnectWithoutTaskInput | Prisma.SubtaskCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.SubtaskUpsertWithWhereUniqueWithoutTaskInput | Prisma.SubtaskUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.SubtaskCreateManyTaskInputEnvelope;
    set?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    disconnect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    delete?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    connect?: Prisma.SubtaskWhereUniqueInput | Prisma.SubtaskWhereUniqueInput[];
    update?: Prisma.SubtaskUpdateWithWhereUniqueWithoutTaskInput | Prisma.SubtaskUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.SubtaskUpdateManyWithWhereWithoutTaskInput | Prisma.SubtaskUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.SubtaskScalarWhereInput | Prisma.SubtaskScalarWhereInput[];
};
export type SubtaskCreateWithoutAssigneeInput = {
    id?: string;
    title: string;
    completed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutSubtasksInput;
};
export type SubtaskUncheckedCreateWithoutAssigneeInput = {
    id?: string;
    taskId: string;
    title: string;
    completed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubtaskCreateOrConnectWithoutAssigneeInput = {
    where: Prisma.SubtaskWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubtaskCreateWithoutAssigneeInput, Prisma.SubtaskUncheckedCreateWithoutAssigneeInput>;
};
export type SubtaskCreateManyAssigneeInputEnvelope = {
    data: Prisma.SubtaskCreateManyAssigneeInput | Prisma.SubtaskCreateManyAssigneeInput[];
    skipDuplicates?: boolean;
};
export type SubtaskUpsertWithWhereUniqueWithoutAssigneeInput = {
    where: Prisma.SubtaskWhereUniqueInput;
    update: Prisma.XOR<Prisma.SubtaskUpdateWithoutAssigneeInput, Prisma.SubtaskUncheckedUpdateWithoutAssigneeInput>;
    create: Prisma.XOR<Prisma.SubtaskCreateWithoutAssigneeInput, Prisma.SubtaskUncheckedCreateWithoutAssigneeInput>;
};
export type SubtaskUpdateWithWhereUniqueWithoutAssigneeInput = {
    where: Prisma.SubtaskWhereUniqueInput;
    data: Prisma.XOR<Prisma.SubtaskUpdateWithoutAssigneeInput, Prisma.SubtaskUncheckedUpdateWithoutAssigneeInput>;
};
export type SubtaskUpdateManyWithWhereWithoutAssigneeInput = {
    where: Prisma.SubtaskScalarWhereInput;
    data: Prisma.XOR<Prisma.SubtaskUpdateManyMutationInput, Prisma.SubtaskUncheckedUpdateManyWithoutAssigneeInput>;
};
export type SubtaskScalarWhereInput = {
    AND?: Prisma.SubtaskScalarWhereInput | Prisma.SubtaskScalarWhereInput[];
    OR?: Prisma.SubtaskScalarWhereInput[];
    NOT?: Prisma.SubtaskScalarWhereInput | Prisma.SubtaskScalarWhereInput[];
    id?: Prisma.StringFilter<"Subtask"> | string;
    taskId?: Prisma.StringFilter<"Subtask"> | string;
    title?: Prisma.StringFilter<"Subtask"> | string;
    completed?: Prisma.BoolFilter<"Subtask"> | boolean;
    assigneeId?: Prisma.StringNullableFilter<"Subtask"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Subtask"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Subtask"> | Date | string;
};
export type SubtaskCreateWithoutTaskInput = {
    id?: string;
    title: string;
    completed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    assignee?: Prisma.UserCreateNestedOneWithoutSubtasksInput;
};
export type SubtaskUncheckedCreateWithoutTaskInput = {
    id?: string;
    title: string;
    completed?: boolean;
    assigneeId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubtaskCreateOrConnectWithoutTaskInput = {
    where: Prisma.SubtaskWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubtaskCreateWithoutTaskInput, Prisma.SubtaskUncheckedCreateWithoutTaskInput>;
};
export type SubtaskCreateManyTaskInputEnvelope = {
    data: Prisma.SubtaskCreateManyTaskInput | Prisma.SubtaskCreateManyTaskInput[];
    skipDuplicates?: boolean;
};
export type SubtaskUpsertWithWhereUniqueWithoutTaskInput = {
    where: Prisma.SubtaskWhereUniqueInput;
    update: Prisma.XOR<Prisma.SubtaskUpdateWithoutTaskInput, Prisma.SubtaskUncheckedUpdateWithoutTaskInput>;
    create: Prisma.XOR<Prisma.SubtaskCreateWithoutTaskInput, Prisma.SubtaskUncheckedCreateWithoutTaskInput>;
};
export type SubtaskUpdateWithWhereUniqueWithoutTaskInput = {
    where: Prisma.SubtaskWhereUniqueInput;
    data: Prisma.XOR<Prisma.SubtaskUpdateWithoutTaskInput, Prisma.SubtaskUncheckedUpdateWithoutTaskInput>;
};
export type SubtaskUpdateManyWithWhereWithoutTaskInput = {
    where: Prisma.SubtaskScalarWhereInput;
    data: Prisma.XOR<Prisma.SubtaskUpdateManyMutationInput, Prisma.SubtaskUncheckedUpdateManyWithoutTaskInput>;
};
export type SubtaskCreateManyAssigneeInput = {
    id?: string;
    taskId: string;
    title: string;
    completed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubtaskUpdateWithoutAssigneeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutSubtasksNestedInput;
};
export type SubtaskUncheckedUpdateWithoutAssigneeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubtaskUncheckedUpdateManyWithoutAssigneeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubtaskCreateManyTaskInput = {
    id?: string;
    title: string;
    completed?: boolean;
    assigneeId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubtaskUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    assignee?: Prisma.UserUpdateOneWithoutSubtasksNestedInput;
};
export type SubtaskUncheckedUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assigneeId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubtaskUncheckedUpdateManyWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assigneeId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubtaskSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    title?: boolean;
    completed?: boolean;
    assigneeId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    assignee?: boolean | Prisma.Subtask$assigneeArgs<ExtArgs>;
}, ExtArgs["result"]["subtask"]>;
export type SubtaskSelectScalar = {
    id?: boolean;
    taskId?: boolean;
    title?: boolean;
    completed?: boolean;
    assigneeId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type SubtaskOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "taskId" | "title" | "completed" | "assigneeId" | "createdAt" | "updatedAt", ExtArgs["result"]["subtask"]>;
export type SubtaskInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    assignee?: boolean | Prisma.Subtask$assigneeArgs<ExtArgs>;
};
export type $SubtaskPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Subtask";
    objects: {
        task: Prisma.$TaskPayload<ExtArgs>;
        assignee: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        taskId: string;
        title: string;
        completed: boolean;
        assigneeId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["subtask"]>;
    composites: {};
};
export type SubtaskGetPayload<S extends boolean | null | undefined | SubtaskDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SubtaskPayload, S>;
export type SubtaskCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SubtaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SubtaskCountAggregateInputType | true;
};
export interface SubtaskDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Subtask'];
        meta: {
            name: 'Subtask';
        };
    };
    findUnique<T extends SubtaskFindUniqueArgs>(args: Prisma.SelectSubset<T, SubtaskFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SubtaskFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SubtaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SubtaskFindFirstArgs>(args?: Prisma.SelectSubset<T, SubtaskFindFirstArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SubtaskFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SubtaskFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SubtaskFindManyArgs>(args?: Prisma.SelectSubset<T, SubtaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SubtaskCreateArgs>(args: Prisma.SelectSubset<T, SubtaskCreateArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SubtaskCreateManyArgs>(args?: Prisma.SelectSubset<T, SubtaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends SubtaskDeleteArgs>(args: Prisma.SelectSubset<T, SubtaskDeleteArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SubtaskUpdateArgs>(args: Prisma.SelectSubset<T, SubtaskUpdateArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SubtaskDeleteManyArgs>(args?: Prisma.SelectSubset<T, SubtaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SubtaskUpdateManyArgs>(args: Prisma.SelectSubset<T, SubtaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends SubtaskUpsertArgs>(args: Prisma.SelectSubset<T, SubtaskUpsertArgs<ExtArgs>>): Prisma.Prisma__SubtaskClient<runtime.Types.Result.GetResult<Prisma.$SubtaskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SubtaskCountArgs>(args?: Prisma.Subset<T, SubtaskCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SubtaskCountAggregateOutputType> : number>;
    aggregate<T extends SubtaskAggregateArgs>(args: Prisma.Subset<T, SubtaskAggregateArgs>): Prisma.PrismaPromise<GetSubtaskAggregateType<T>>;
    groupBy<T extends SubtaskGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SubtaskGroupByArgs['orderBy'];
    } : {
        orderBy?: SubtaskGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SubtaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubtaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SubtaskFieldRefs;
}
export interface Prisma__SubtaskClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    task<T extends Prisma.TaskDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskDefaultArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    assignee<T extends Prisma.Subtask$assigneeArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Subtask$assigneeArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SubtaskFieldRefs {
    readonly id: Prisma.FieldRef<"Subtask", 'String'>;
    readonly taskId: Prisma.FieldRef<"Subtask", 'String'>;
    readonly title: Prisma.FieldRef<"Subtask", 'String'>;
    readonly completed: Prisma.FieldRef<"Subtask", 'Boolean'>;
    readonly assigneeId: Prisma.FieldRef<"Subtask", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Subtask", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Subtask", 'DateTime'>;
}
export type SubtaskFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where: Prisma.SubtaskWhereUniqueInput;
};
export type SubtaskFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where: Prisma.SubtaskWhereUniqueInput;
};
export type SubtaskFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where?: Prisma.SubtaskWhereInput;
    orderBy?: Prisma.SubtaskOrderByWithRelationInput | Prisma.SubtaskOrderByWithRelationInput[];
    cursor?: Prisma.SubtaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubtaskScalarFieldEnum | Prisma.SubtaskScalarFieldEnum[];
};
export type SubtaskFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where?: Prisma.SubtaskWhereInput;
    orderBy?: Prisma.SubtaskOrderByWithRelationInput | Prisma.SubtaskOrderByWithRelationInput[];
    cursor?: Prisma.SubtaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubtaskScalarFieldEnum | Prisma.SubtaskScalarFieldEnum[];
};
export type SubtaskFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where?: Prisma.SubtaskWhereInput;
    orderBy?: Prisma.SubtaskOrderByWithRelationInput | Prisma.SubtaskOrderByWithRelationInput[];
    cursor?: Prisma.SubtaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubtaskScalarFieldEnum | Prisma.SubtaskScalarFieldEnum[];
};
export type SubtaskCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubtaskCreateInput, Prisma.SubtaskUncheckedCreateInput>;
};
export type SubtaskCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SubtaskCreateManyInput | Prisma.SubtaskCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubtaskUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubtaskUpdateInput, Prisma.SubtaskUncheckedUpdateInput>;
    where: Prisma.SubtaskWhereUniqueInput;
};
export type SubtaskUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SubtaskUpdateManyMutationInput, Prisma.SubtaskUncheckedUpdateManyInput>;
    where?: Prisma.SubtaskWhereInput;
    limit?: number;
};
export type SubtaskUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where: Prisma.SubtaskWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubtaskCreateInput, Prisma.SubtaskUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SubtaskUpdateInput, Prisma.SubtaskUncheckedUpdateInput>;
};
export type SubtaskDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
    where: Prisma.SubtaskWhereUniqueInput;
};
export type SubtaskDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubtaskWhereInput;
    limit?: number;
};
export type Subtask$assigneeArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type SubtaskDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubtaskSelect<ExtArgs> | null;
    omit?: Prisma.SubtaskOmit<ExtArgs> | null;
    include?: Prisma.SubtaskInclude<ExtArgs> | null;
};
