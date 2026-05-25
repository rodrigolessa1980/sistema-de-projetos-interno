import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TaskNoteModel = runtime.Types.Result.DefaultSelection<Prisma.$TaskNotePayload>;
export type AggregateTaskNote = {
    _count: TaskNoteCountAggregateOutputType | null;
    _min: TaskNoteMinAggregateOutputType | null;
    _max: TaskNoteMaxAggregateOutputType | null;
};
export type TaskNoteMinAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    userId: string | null;
    content: string | null;
    isPinned: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TaskNoteMaxAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    userId: string | null;
    content: string | null;
    isPinned: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TaskNoteCountAggregateOutputType = {
    id: number;
    taskId: number;
    userId: number;
    content: number;
    isPinned: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type TaskNoteMinAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    content?: true;
    isPinned?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TaskNoteMaxAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    content?: true;
    isPinned?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TaskNoteCountAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    content?: true;
    isPinned?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type TaskNoteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskNoteWhereInput;
    orderBy?: Prisma.TaskNoteOrderByWithRelationInput | Prisma.TaskNoteOrderByWithRelationInput[];
    cursor?: Prisma.TaskNoteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TaskNoteCountAggregateInputType;
    _min?: TaskNoteMinAggregateInputType;
    _max?: TaskNoteMaxAggregateInputType;
};
export type GetTaskNoteAggregateType<T extends TaskNoteAggregateArgs> = {
    [P in keyof T & keyof AggregateTaskNote]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTaskNote[P]> : Prisma.GetScalarType<T[P], AggregateTaskNote[P]>;
};
export type TaskNoteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskNoteWhereInput;
    orderBy?: Prisma.TaskNoteOrderByWithAggregationInput | Prisma.TaskNoteOrderByWithAggregationInput[];
    by: Prisma.TaskNoteScalarFieldEnum[] | Prisma.TaskNoteScalarFieldEnum;
    having?: Prisma.TaskNoteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TaskNoteCountAggregateInputType | true;
    _min?: TaskNoteMinAggregateInputType;
    _max?: TaskNoteMaxAggregateInputType;
};
export type TaskNoteGroupByOutputType = {
    id: string;
    taskId: string;
    userId: string;
    content: string;
    isPinned: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: TaskNoteCountAggregateOutputType | null;
    _min: TaskNoteMinAggregateOutputType | null;
    _max: TaskNoteMaxAggregateOutputType | null;
};
export type GetTaskNoteGroupByPayload<T extends TaskNoteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TaskNoteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TaskNoteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TaskNoteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TaskNoteGroupByOutputType[P]>;
}>>;
export type TaskNoteWhereInput = {
    AND?: Prisma.TaskNoteWhereInput | Prisma.TaskNoteWhereInput[];
    OR?: Prisma.TaskNoteWhereInput[];
    NOT?: Prisma.TaskNoteWhereInput | Prisma.TaskNoteWhereInput[];
    id?: Prisma.StringFilter<"TaskNote"> | string;
    taskId?: Prisma.StringFilter<"TaskNote"> | string;
    userId?: Prisma.StringFilter<"TaskNote"> | string;
    content?: Prisma.StringFilter<"TaskNote"> | string;
    isPinned?: Prisma.BoolFilter<"TaskNote"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TaskNote"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TaskNote"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type TaskNoteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isPinned?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    task?: Prisma.TaskOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    _relevance?: Prisma.TaskNoteOrderByRelevanceInput;
};
export type TaskNoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.TaskNoteWhereInput | Prisma.TaskNoteWhereInput[];
    OR?: Prisma.TaskNoteWhereInput[];
    NOT?: Prisma.TaskNoteWhereInput | Prisma.TaskNoteWhereInput[];
    taskId?: Prisma.StringFilter<"TaskNote"> | string;
    userId?: Prisma.StringFilter<"TaskNote"> | string;
    content?: Prisma.StringFilter<"TaskNote"> | string;
    isPinned?: Prisma.BoolFilter<"TaskNote"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TaskNote"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TaskNote"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type TaskNoteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isPinned?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.TaskNoteCountOrderByAggregateInput;
    _max?: Prisma.TaskNoteMaxOrderByAggregateInput;
    _min?: Prisma.TaskNoteMinOrderByAggregateInput;
};
export type TaskNoteScalarWhereWithAggregatesInput = {
    AND?: Prisma.TaskNoteScalarWhereWithAggregatesInput | Prisma.TaskNoteScalarWhereWithAggregatesInput[];
    OR?: Prisma.TaskNoteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TaskNoteScalarWhereWithAggregatesInput | Prisma.TaskNoteScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"TaskNote"> | string;
    taskId?: Prisma.StringWithAggregatesFilter<"TaskNote"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"TaskNote"> | string;
    content?: Prisma.StringWithAggregatesFilter<"TaskNote"> | string;
    isPinned?: Prisma.BoolWithAggregatesFilter<"TaskNote"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"TaskNote"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"TaskNote"> | Date | string;
};
export type TaskNoteCreateInput = {
    id?: string;
    content: string;
    isPinned?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutNotesInput;
    user: Prisma.UserCreateNestedOneWithoutTaskNotesInput;
};
export type TaskNoteUncheckedCreateInput = {
    id?: string;
    taskId: string;
    userId: string;
    content: string;
    isPinned?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TaskNoteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isPinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutNotesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutTaskNotesNestedInput;
};
export type TaskNoteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isPinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskNoteCreateManyInput = {
    id?: string;
    taskId: string;
    userId: string;
    content: string;
    isPinned?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TaskNoteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isPinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskNoteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isPinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskNoteListRelationFilter = {
    every?: Prisma.TaskNoteWhereInput;
    some?: Prisma.TaskNoteWhereInput;
    none?: Prisma.TaskNoteWhereInput;
};
export type TaskNoteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TaskNoteOrderByRelevanceInput = {
    fields: Prisma.TaskNoteOrderByRelevanceFieldEnum | Prisma.TaskNoteOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type TaskNoteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isPinned?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TaskNoteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isPinned?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TaskNoteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isPinned?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TaskNoteCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TaskNoteCreateWithoutUserInput, Prisma.TaskNoteUncheckedCreateWithoutUserInput> | Prisma.TaskNoteCreateWithoutUserInput[] | Prisma.TaskNoteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskNoteCreateOrConnectWithoutUserInput | Prisma.TaskNoteCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TaskNoteCreateManyUserInputEnvelope;
    connect?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
};
export type TaskNoteUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TaskNoteCreateWithoutUserInput, Prisma.TaskNoteUncheckedCreateWithoutUserInput> | Prisma.TaskNoteCreateWithoutUserInput[] | Prisma.TaskNoteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskNoteCreateOrConnectWithoutUserInput | Prisma.TaskNoteCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TaskNoteCreateManyUserInputEnvelope;
    connect?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
};
export type TaskNoteUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TaskNoteCreateWithoutUserInput, Prisma.TaskNoteUncheckedCreateWithoutUserInput> | Prisma.TaskNoteCreateWithoutUserInput[] | Prisma.TaskNoteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskNoteCreateOrConnectWithoutUserInput | Prisma.TaskNoteCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TaskNoteUpsertWithWhereUniqueWithoutUserInput | Prisma.TaskNoteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TaskNoteCreateManyUserInputEnvelope;
    set?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    disconnect?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    delete?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    connect?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    update?: Prisma.TaskNoteUpdateWithWhereUniqueWithoutUserInput | Prisma.TaskNoteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TaskNoteUpdateManyWithWhereWithoutUserInput | Prisma.TaskNoteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TaskNoteScalarWhereInput | Prisma.TaskNoteScalarWhereInput[];
};
export type TaskNoteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TaskNoteCreateWithoutUserInput, Prisma.TaskNoteUncheckedCreateWithoutUserInput> | Prisma.TaskNoteCreateWithoutUserInput[] | Prisma.TaskNoteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskNoteCreateOrConnectWithoutUserInput | Prisma.TaskNoteCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TaskNoteUpsertWithWhereUniqueWithoutUserInput | Prisma.TaskNoteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TaskNoteCreateManyUserInputEnvelope;
    set?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    disconnect?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    delete?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    connect?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    update?: Prisma.TaskNoteUpdateWithWhereUniqueWithoutUserInput | Prisma.TaskNoteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TaskNoteUpdateManyWithWhereWithoutUserInput | Prisma.TaskNoteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TaskNoteScalarWhereInput | Prisma.TaskNoteScalarWhereInput[];
};
export type TaskNoteCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TaskNoteCreateWithoutTaskInput, Prisma.TaskNoteUncheckedCreateWithoutTaskInput> | Prisma.TaskNoteCreateWithoutTaskInput[] | Prisma.TaskNoteUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskNoteCreateOrConnectWithoutTaskInput | Prisma.TaskNoteCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TaskNoteCreateManyTaskInputEnvelope;
    connect?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
};
export type TaskNoteUncheckedCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TaskNoteCreateWithoutTaskInput, Prisma.TaskNoteUncheckedCreateWithoutTaskInput> | Prisma.TaskNoteCreateWithoutTaskInput[] | Prisma.TaskNoteUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskNoteCreateOrConnectWithoutTaskInput | Prisma.TaskNoteCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TaskNoteCreateManyTaskInputEnvelope;
    connect?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
};
export type TaskNoteUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TaskNoteCreateWithoutTaskInput, Prisma.TaskNoteUncheckedCreateWithoutTaskInput> | Prisma.TaskNoteCreateWithoutTaskInput[] | Prisma.TaskNoteUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskNoteCreateOrConnectWithoutTaskInput | Prisma.TaskNoteCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TaskNoteUpsertWithWhereUniqueWithoutTaskInput | Prisma.TaskNoteUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TaskNoteCreateManyTaskInputEnvelope;
    set?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    disconnect?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    delete?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    connect?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    update?: Prisma.TaskNoteUpdateWithWhereUniqueWithoutTaskInput | Prisma.TaskNoteUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TaskNoteUpdateManyWithWhereWithoutTaskInput | Prisma.TaskNoteUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TaskNoteScalarWhereInput | Prisma.TaskNoteScalarWhereInput[];
};
export type TaskNoteUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TaskNoteCreateWithoutTaskInput, Prisma.TaskNoteUncheckedCreateWithoutTaskInput> | Prisma.TaskNoteCreateWithoutTaskInput[] | Prisma.TaskNoteUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskNoteCreateOrConnectWithoutTaskInput | Prisma.TaskNoteCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TaskNoteUpsertWithWhereUniqueWithoutTaskInput | Prisma.TaskNoteUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TaskNoteCreateManyTaskInputEnvelope;
    set?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    disconnect?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    delete?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    connect?: Prisma.TaskNoteWhereUniqueInput | Prisma.TaskNoteWhereUniqueInput[];
    update?: Prisma.TaskNoteUpdateWithWhereUniqueWithoutTaskInput | Prisma.TaskNoteUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TaskNoteUpdateManyWithWhereWithoutTaskInput | Prisma.TaskNoteUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TaskNoteScalarWhereInput | Prisma.TaskNoteScalarWhereInput[];
};
export type TaskNoteCreateWithoutUserInput = {
    id?: string;
    content: string;
    isPinned?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutNotesInput;
};
export type TaskNoteUncheckedCreateWithoutUserInput = {
    id?: string;
    taskId: string;
    content: string;
    isPinned?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TaskNoteCreateOrConnectWithoutUserInput = {
    where: Prisma.TaskNoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskNoteCreateWithoutUserInput, Prisma.TaskNoteUncheckedCreateWithoutUserInput>;
};
export type TaskNoteCreateManyUserInputEnvelope = {
    data: Prisma.TaskNoteCreateManyUserInput | Prisma.TaskNoteCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type TaskNoteUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.TaskNoteWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskNoteUpdateWithoutUserInput, Prisma.TaskNoteUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TaskNoteCreateWithoutUserInput, Prisma.TaskNoteUncheckedCreateWithoutUserInput>;
};
export type TaskNoteUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.TaskNoteWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskNoteUpdateWithoutUserInput, Prisma.TaskNoteUncheckedUpdateWithoutUserInput>;
};
export type TaskNoteUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.TaskNoteScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskNoteUpdateManyMutationInput, Prisma.TaskNoteUncheckedUpdateManyWithoutUserInput>;
};
export type TaskNoteScalarWhereInput = {
    AND?: Prisma.TaskNoteScalarWhereInput | Prisma.TaskNoteScalarWhereInput[];
    OR?: Prisma.TaskNoteScalarWhereInput[];
    NOT?: Prisma.TaskNoteScalarWhereInput | Prisma.TaskNoteScalarWhereInput[];
    id?: Prisma.StringFilter<"TaskNote"> | string;
    taskId?: Prisma.StringFilter<"TaskNote"> | string;
    userId?: Prisma.StringFilter<"TaskNote"> | string;
    content?: Prisma.StringFilter<"TaskNote"> | string;
    isPinned?: Prisma.BoolFilter<"TaskNote"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TaskNote"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TaskNote"> | Date | string;
};
export type TaskNoteCreateWithoutTaskInput = {
    id?: string;
    content: string;
    isPinned?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutTaskNotesInput;
};
export type TaskNoteUncheckedCreateWithoutTaskInput = {
    id?: string;
    userId: string;
    content: string;
    isPinned?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TaskNoteCreateOrConnectWithoutTaskInput = {
    where: Prisma.TaskNoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskNoteCreateWithoutTaskInput, Prisma.TaskNoteUncheckedCreateWithoutTaskInput>;
};
export type TaskNoteCreateManyTaskInputEnvelope = {
    data: Prisma.TaskNoteCreateManyTaskInput | Prisma.TaskNoteCreateManyTaskInput[];
    skipDuplicates?: boolean;
};
export type TaskNoteUpsertWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TaskNoteWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskNoteUpdateWithoutTaskInput, Prisma.TaskNoteUncheckedUpdateWithoutTaskInput>;
    create: Prisma.XOR<Prisma.TaskNoteCreateWithoutTaskInput, Prisma.TaskNoteUncheckedCreateWithoutTaskInput>;
};
export type TaskNoteUpdateWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TaskNoteWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskNoteUpdateWithoutTaskInput, Prisma.TaskNoteUncheckedUpdateWithoutTaskInput>;
};
export type TaskNoteUpdateManyWithWhereWithoutTaskInput = {
    where: Prisma.TaskNoteScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskNoteUpdateManyMutationInput, Prisma.TaskNoteUncheckedUpdateManyWithoutTaskInput>;
};
export type TaskNoteCreateManyUserInput = {
    id?: string;
    taskId: string;
    content: string;
    isPinned?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TaskNoteUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isPinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutNotesNestedInput;
};
export type TaskNoteUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isPinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskNoteUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isPinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskNoteCreateManyTaskInput = {
    id?: string;
    userId: string;
    content: string;
    isPinned?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TaskNoteUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isPinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutTaskNotesNestedInput;
};
export type TaskNoteUncheckedUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isPinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskNoteUncheckedUpdateManyWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isPinned?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskNoteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    content?: boolean;
    isPinned?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["taskNote"]>;
export type TaskNoteSelectScalar = {
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    content?: boolean;
    isPinned?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type TaskNoteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "taskId" | "userId" | "content" | "isPinned" | "createdAt" | "updatedAt", ExtArgs["result"]["taskNote"]>;
export type TaskNoteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $TaskNotePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TaskNote";
    objects: {
        task: Prisma.$TaskPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        taskId: string;
        userId: string;
        content: string;
        isPinned: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["taskNote"]>;
    composites: {};
};
export type TaskNoteGetPayload<S extends boolean | null | undefined | TaskNoteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TaskNotePayload, S>;
export type TaskNoteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TaskNoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TaskNoteCountAggregateInputType | true;
};
export interface TaskNoteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TaskNote'];
        meta: {
            name: 'TaskNote';
        };
    };
    findUnique<T extends TaskNoteFindUniqueArgs>(args: Prisma.SelectSubset<T, TaskNoteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TaskNoteClient<runtime.Types.Result.GetResult<Prisma.$TaskNotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TaskNoteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TaskNoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskNoteClient<runtime.Types.Result.GetResult<Prisma.$TaskNotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TaskNoteFindFirstArgs>(args?: Prisma.SelectSubset<T, TaskNoteFindFirstArgs<ExtArgs>>): Prisma.Prisma__TaskNoteClient<runtime.Types.Result.GetResult<Prisma.$TaskNotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TaskNoteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TaskNoteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskNoteClient<runtime.Types.Result.GetResult<Prisma.$TaskNotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TaskNoteFindManyArgs>(args?: Prisma.SelectSubset<T, TaskNoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskNotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TaskNoteCreateArgs>(args: Prisma.SelectSubset<T, TaskNoteCreateArgs<ExtArgs>>): Prisma.Prisma__TaskNoteClient<runtime.Types.Result.GetResult<Prisma.$TaskNotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TaskNoteCreateManyArgs>(args?: Prisma.SelectSubset<T, TaskNoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends TaskNoteDeleteArgs>(args: Prisma.SelectSubset<T, TaskNoteDeleteArgs<ExtArgs>>): Prisma.Prisma__TaskNoteClient<runtime.Types.Result.GetResult<Prisma.$TaskNotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TaskNoteUpdateArgs>(args: Prisma.SelectSubset<T, TaskNoteUpdateArgs<ExtArgs>>): Prisma.Prisma__TaskNoteClient<runtime.Types.Result.GetResult<Prisma.$TaskNotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TaskNoteDeleteManyArgs>(args?: Prisma.SelectSubset<T, TaskNoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TaskNoteUpdateManyArgs>(args: Prisma.SelectSubset<T, TaskNoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends TaskNoteUpsertArgs>(args: Prisma.SelectSubset<T, TaskNoteUpsertArgs<ExtArgs>>): Prisma.Prisma__TaskNoteClient<runtime.Types.Result.GetResult<Prisma.$TaskNotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TaskNoteCountArgs>(args?: Prisma.Subset<T, TaskNoteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TaskNoteCountAggregateOutputType> : number>;
    aggregate<T extends TaskNoteAggregateArgs>(args: Prisma.Subset<T, TaskNoteAggregateArgs>): Prisma.PrismaPromise<GetTaskNoteAggregateType<T>>;
    groupBy<T extends TaskNoteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TaskNoteGroupByArgs['orderBy'];
    } : {
        orderBy?: TaskNoteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TaskNoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskNoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TaskNoteFieldRefs;
}
export interface Prisma__TaskNoteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    task<T extends Prisma.TaskDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskDefaultArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TaskNoteFieldRefs {
    readonly id: Prisma.FieldRef<"TaskNote", 'String'>;
    readonly taskId: Prisma.FieldRef<"TaskNote", 'String'>;
    readonly userId: Prisma.FieldRef<"TaskNote", 'String'>;
    readonly content: Prisma.FieldRef<"TaskNote", 'String'>;
    readonly isPinned: Prisma.FieldRef<"TaskNote", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"TaskNote", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"TaskNote", 'DateTime'>;
}
export type TaskNoteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskNoteSelect<ExtArgs> | null;
    omit?: Prisma.TaskNoteOmit<ExtArgs> | null;
    include?: Prisma.TaskNoteInclude<ExtArgs> | null;
    where: Prisma.TaskNoteWhereUniqueInput;
};
export type TaskNoteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskNoteSelect<ExtArgs> | null;
    omit?: Prisma.TaskNoteOmit<ExtArgs> | null;
    include?: Prisma.TaskNoteInclude<ExtArgs> | null;
    where: Prisma.TaskNoteWhereUniqueInput;
};
export type TaskNoteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskNoteSelect<ExtArgs> | null;
    omit?: Prisma.TaskNoteOmit<ExtArgs> | null;
    include?: Prisma.TaskNoteInclude<ExtArgs> | null;
    where?: Prisma.TaskNoteWhereInput;
    orderBy?: Prisma.TaskNoteOrderByWithRelationInput | Prisma.TaskNoteOrderByWithRelationInput[];
    cursor?: Prisma.TaskNoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskNoteScalarFieldEnum | Prisma.TaskNoteScalarFieldEnum[];
};
export type TaskNoteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskNoteSelect<ExtArgs> | null;
    omit?: Prisma.TaskNoteOmit<ExtArgs> | null;
    include?: Prisma.TaskNoteInclude<ExtArgs> | null;
    where?: Prisma.TaskNoteWhereInput;
    orderBy?: Prisma.TaskNoteOrderByWithRelationInput | Prisma.TaskNoteOrderByWithRelationInput[];
    cursor?: Prisma.TaskNoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskNoteScalarFieldEnum | Prisma.TaskNoteScalarFieldEnum[];
};
export type TaskNoteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskNoteSelect<ExtArgs> | null;
    omit?: Prisma.TaskNoteOmit<ExtArgs> | null;
    include?: Prisma.TaskNoteInclude<ExtArgs> | null;
    where?: Prisma.TaskNoteWhereInput;
    orderBy?: Prisma.TaskNoteOrderByWithRelationInput | Prisma.TaskNoteOrderByWithRelationInput[];
    cursor?: Prisma.TaskNoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskNoteScalarFieldEnum | Prisma.TaskNoteScalarFieldEnum[];
};
export type TaskNoteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskNoteSelect<ExtArgs> | null;
    omit?: Prisma.TaskNoteOmit<ExtArgs> | null;
    include?: Prisma.TaskNoteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskNoteCreateInput, Prisma.TaskNoteUncheckedCreateInput>;
};
export type TaskNoteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TaskNoteCreateManyInput | Prisma.TaskNoteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TaskNoteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskNoteSelect<ExtArgs> | null;
    omit?: Prisma.TaskNoteOmit<ExtArgs> | null;
    include?: Prisma.TaskNoteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskNoteUpdateInput, Prisma.TaskNoteUncheckedUpdateInput>;
    where: Prisma.TaskNoteWhereUniqueInput;
};
export type TaskNoteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TaskNoteUpdateManyMutationInput, Prisma.TaskNoteUncheckedUpdateManyInput>;
    where?: Prisma.TaskNoteWhereInput;
    limit?: number;
};
export type TaskNoteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskNoteSelect<ExtArgs> | null;
    omit?: Prisma.TaskNoteOmit<ExtArgs> | null;
    include?: Prisma.TaskNoteInclude<ExtArgs> | null;
    where: Prisma.TaskNoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskNoteCreateInput, Prisma.TaskNoteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TaskNoteUpdateInput, Prisma.TaskNoteUncheckedUpdateInput>;
};
export type TaskNoteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskNoteSelect<ExtArgs> | null;
    omit?: Prisma.TaskNoteOmit<ExtArgs> | null;
    include?: Prisma.TaskNoteInclude<ExtArgs> | null;
    where: Prisma.TaskNoteWhereUniqueInput;
};
export type TaskNoteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskNoteWhereInput;
    limit?: number;
};
export type TaskNoteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskNoteSelect<ExtArgs> | null;
    omit?: Prisma.TaskNoteOmit<ExtArgs> | null;
    include?: Prisma.TaskNoteInclude<ExtArgs> | null;
};
