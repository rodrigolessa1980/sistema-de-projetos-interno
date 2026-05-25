import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CommentModel = runtime.Types.Result.DefaultSelection<Prisma.$CommentPayload>;
export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null;
    _min: CommentMinAggregateOutputType | null;
    _max: CommentMaxAggregateOutputType | null;
};
export type CommentMinAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    userId: string | null;
    content: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CommentMaxAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    userId: string | null;
    content: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CommentCountAggregateOutputType = {
    id: number;
    taskId: number;
    userId: number;
    content: number;
    mentions: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CommentMinAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    content?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CommentMaxAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    content?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CommentCountAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    content?: true;
    mentions?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CommentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CommentCountAggregateInputType;
    _min?: CommentMinAggregateInputType;
    _max?: CommentMaxAggregateInputType;
};
export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
    [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateComment[P]> : Prisma.GetScalarType<T[P], AggregateComment[P]>;
};
export type CommentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithAggregationInput | Prisma.CommentOrderByWithAggregationInput[];
    by: Prisma.CommentScalarFieldEnum[] | Prisma.CommentScalarFieldEnum;
    having?: Prisma.CommentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CommentCountAggregateInputType | true;
    _min?: CommentMinAggregateInputType;
    _max?: CommentMaxAggregateInputType;
};
export type CommentGroupByOutputType = {
    id: string;
    taskId: string;
    userId: string;
    content: string;
    mentions: runtime.JsonValue;
    createdAt: Date;
    updatedAt: Date;
    _count: CommentCountAggregateOutputType | null;
    _min: CommentMinAggregateOutputType | null;
    _max: CommentMaxAggregateOutputType | null;
};
export type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CommentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CommentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CommentGroupByOutputType[P]>;
}>>;
export type CommentWhereInput = {
    AND?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    OR?: Prisma.CommentWhereInput[];
    NOT?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    id?: Prisma.StringFilter<"Comment"> | string;
    taskId?: Prisma.StringFilter<"Comment"> | string;
    userId?: Prisma.StringFilter<"Comment"> | string;
    content?: Prisma.StringFilter<"Comment"> | string;
    mentions?: Prisma.JsonFilter<"Comment">;
    createdAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type CommentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    mentions?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    task?: Prisma.TaskOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    _relevance?: Prisma.CommentOrderByRelevanceInput;
};
export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    OR?: Prisma.CommentWhereInput[];
    NOT?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    taskId?: Prisma.StringFilter<"Comment"> | string;
    userId?: Prisma.StringFilter<"Comment"> | string;
    content?: Prisma.StringFilter<"Comment"> | string;
    mentions?: Prisma.JsonFilter<"Comment">;
    createdAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type CommentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    mentions?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CommentCountOrderByAggregateInput;
    _max?: Prisma.CommentMaxOrderByAggregateInput;
    _min?: Prisma.CommentMinOrderByAggregateInput;
};
export type CommentScalarWhereWithAggregatesInput = {
    AND?: Prisma.CommentScalarWhereWithAggregatesInput | Prisma.CommentScalarWhereWithAggregatesInput[];
    OR?: Prisma.CommentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CommentScalarWhereWithAggregatesInput | Prisma.CommentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    taskId?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    content?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    mentions?: Prisma.JsonWithAggregatesFilter<"Comment">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Comment"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Comment"> | Date | string;
};
export type CommentCreateInput = {
    id?: string;
    content: string;
    mentions: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutCommentsInput;
    user: Prisma.UserCreateNestedOneWithoutCommentsInput;
};
export type CommentUncheckedCreateInput = {
    id?: string;
    taskId: string;
    userId: string;
    content: string;
    mentions: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CommentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    mentions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutCommentsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutCommentsNestedInput;
};
export type CommentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    mentions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentCreateManyInput = {
    id?: string;
    taskId: string;
    userId: string;
    content: string;
    mentions: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CommentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    mentions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    mentions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentListRelationFilter = {
    every?: Prisma.CommentWhereInput;
    some?: Prisma.CommentWhereInput;
    none?: Prisma.CommentWhereInput;
};
export type CommentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CommentOrderByRelevanceInput = {
    fields: Prisma.CommentOrderByRelevanceFieldEnum | Prisma.CommentOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type CommentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    mentions?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CommentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CommentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CommentCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutUserInput, Prisma.CommentUncheckedCreateWithoutUserInput> | Prisma.CommentCreateWithoutUserInput[] | Prisma.CommentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutUserInput | Prisma.CommentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.CommentCreateManyUserInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutUserInput, Prisma.CommentUncheckedCreateWithoutUserInput> | Prisma.CommentCreateWithoutUserInput[] | Prisma.CommentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutUserInput | Prisma.CommentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.CommentCreateManyUserInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutUserInput, Prisma.CommentUncheckedCreateWithoutUserInput> | Prisma.CommentCreateWithoutUserInput[] | Prisma.CommentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutUserInput | Prisma.CommentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutUserInput | Prisma.CommentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.CommentCreateManyUserInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutUserInput | Prisma.CommentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutUserInput | Prisma.CommentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutUserInput, Prisma.CommentUncheckedCreateWithoutUserInput> | Prisma.CommentCreateWithoutUserInput[] | Prisma.CommentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutUserInput | Prisma.CommentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutUserInput | Prisma.CommentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.CommentCreateManyUserInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutUserInput | Prisma.CommentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutUserInput | Prisma.CommentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutTaskInput, Prisma.CommentUncheckedCreateWithoutTaskInput> | Prisma.CommentCreateWithoutTaskInput[] | Prisma.CommentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutTaskInput | Prisma.CommentCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.CommentCreateManyTaskInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUncheckedCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutTaskInput, Prisma.CommentUncheckedCreateWithoutTaskInput> | Prisma.CommentCreateWithoutTaskInput[] | Prisma.CommentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutTaskInput | Prisma.CommentCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.CommentCreateManyTaskInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutTaskInput, Prisma.CommentUncheckedCreateWithoutTaskInput> | Prisma.CommentCreateWithoutTaskInput[] | Prisma.CommentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutTaskInput | Prisma.CommentCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutTaskInput | Prisma.CommentUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.CommentCreateManyTaskInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutTaskInput | Prisma.CommentUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutTaskInput | Prisma.CommentUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutTaskInput, Prisma.CommentUncheckedCreateWithoutTaskInput> | Prisma.CommentCreateWithoutTaskInput[] | Prisma.CommentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutTaskInput | Prisma.CommentCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutTaskInput | Prisma.CommentUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.CommentCreateManyTaskInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutTaskInput | Prisma.CommentUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutTaskInput | Prisma.CommentUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentCreateWithoutUserInput = {
    id?: string;
    content: string;
    mentions: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutCommentsInput;
};
export type CommentUncheckedCreateWithoutUserInput = {
    id?: string;
    taskId: string;
    content: string;
    mentions: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CommentCreateOrConnectWithoutUserInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutUserInput, Prisma.CommentUncheckedCreateWithoutUserInput>;
};
export type CommentCreateManyUserInputEnvelope = {
    data: Prisma.CommentCreateManyUserInput | Prisma.CommentCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type CommentUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.CommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.CommentUpdateWithoutUserInput, Prisma.CommentUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutUserInput, Prisma.CommentUncheckedCreateWithoutUserInput>;
};
export type CommentUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutUserInput, Prisma.CommentUncheckedUpdateWithoutUserInput>;
};
export type CommentUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.CommentScalarWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyWithoutUserInput>;
};
export type CommentScalarWhereInput = {
    AND?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
    OR?: Prisma.CommentScalarWhereInput[];
    NOT?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
    id?: Prisma.StringFilter<"Comment"> | string;
    taskId?: Prisma.StringFilter<"Comment"> | string;
    userId?: Prisma.StringFilter<"Comment"> | string;
    content?: Prisma.StringFilter<"Comment"> | string;
    mentions?: Prisma.JsonFilter<"Comment">;
    createdAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
};
export type CommentCreateWithoutTaskInput = {
    id?: string;
    content: string;
    mentions: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutCommentsInput;
};
export type CommentUncheckedCreateWithoutTaskInput = {
    id?: string;
    userId: string;
    content: string;
    mentions: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CommentCreateOrConnectWithoutTaskInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutTaskInput, Prisma.CommentUncheckedCreateWithoutTaskInput>;
};
export type CommentCreateManyTaskInputEnvelope = {
    data: Prisma.CommentCreateManyTaskInput | Prisma.CommentCreateManyTaskInput[];
    skipDuplicates?: boolean;
};
export type CommentUpsertWithWhereUniqueWithoutTaskInput = {
    where: Prisma.CommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.CommentUpdateWithoutTaskInput, Prisma.CommentUncheckedUpdateWithoutTaskInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutTaskInput, Prisma.CommentUncheckedCreateWithoutTaskInput>;
};
export type CommentUpdateWithWhereUniqueWithoutTaskInput = {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutTaskInput, Prisma.CommentUncheckedUpdateWithoutTaskInput>;
};
export type CommentUpdateManyWithWhereWithoutTaskInput = {
    where: Prisma.CommentScalarWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyWithoutTaskInput>;
};
export type CommentCreateManyUserInput = {
    id?: string;
    taskId: string;
    content: string;
    mentions: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CommentUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    mentions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutCommentsNestedInput;
};
export type CommentUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    mentions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    mentions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentCreateManyTaskInput = {
    id?: string;
    userId: string;
    content: string;
    mentions: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CommentUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    mentions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutCommentsNestedInput;
};
export type CommentUncheckedUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    mentions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentUncheckedUpdateManyWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    mentions?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    content?: boolean;
    mentions?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["comment"]>;
export type CommentSelectScalar = {
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    content?: boolean;
    mentions?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CommentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "taskId" | "userId" | "content" | "mentions" | "createdAt" | "updatedAt", ExtArgs["result"]["comment"]>;
export type CommentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $CommentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Comment";
    objects: {
        task: Prisma.$TaskPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        taskId: string;
        userId: string;
        content: string;
        mentions: runtime.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["comment"]>;
    composites: {};
};
export type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CommentPayload, S>;
export type CommentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CommentCountAggregateInputType | true;
};
export interface CommentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Comment'];
        meta: {
            name: 'Comment';
        };
    };
    findUnique<T extends CommentFindUniqueArgs>(args: Prisma.SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CommentFindFirstArgs>(args?: Prisma.SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CommentFindManyArgs>(args?: Prisma.SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CommentCreateArgs>(args: Prisma.SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CommentCreateManyArgs>(args?: Prisma.SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends CommentDeleteArgs>(args: Prisma.SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CommentUpdateArgs>(args: Prisma.SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CommentDeleteManyArgs>(args?: Prisma.SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CommentUpdateManyArgs>(args: Prisma.SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends CommentUpsertArgs>(args: Prisma.SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CommentCountArgs>(args?: Prisma.Subset<T, CommentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CommentCountAggregateOutputType> : number>;
    aggregate<T extends CommentAggregateArgs>(args: Prisma.Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>;
    groupBy<T extends CommentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CommentGroupByArgs['orderBy'];
    } : {
        orderBy?: CommentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CommentFieldRefs;
}
export interface Prisma__CommentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    task<T extends Prisma.TaskDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskDefaultArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CommentFieldRefs {
    readonly id: Prisma.FieldRef<"Comment", 'String'>;
    readonly taskId: Prisma.FieldRef<"Comment", 'String'>;
    readonly userId: Prisma.FieldRef<"Comment", 'String'>;
    readonly content: Prisma.FieldRef<"Comment", 'String'>;
    readonly mentions: Prisma.FieldRef<"Comment", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"Comment", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Comment", 'DateTime'>;
}
export type CommentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type CommentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type CommentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type CommentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommentCreateInput, Prisma.CommentUncheckedCreateInput>;
};
export type CommentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CommentCreateManyInput | Prisma.CommentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CommentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommentUpdateInput, Prisma.CommentUncheckedUpdateInput>;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyInput>;
    where?: Prisma.CommentWhereInput;
    limit?: number;
};
export type CommentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateInput, Prisma.CommentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CommentUpdateInput, Prisma.CommentUncheckedUpdateInput>;
};
export type CommentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
    limit?: number;
};
export type CommentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
};
