import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TaskAttachmentModel = runtime.Types.Result.DefaultSelection<Prisma.$TaskAttachmentPayload>;
export type AggregateTaskAttachment = {
    _count: TaskAttachmentCountAggregateOutputType | null;
    _avg: TaskAttachmentAvgAggregateOutputType | null;
    _sum: TaskAttachmentSumAggregateOutputType | null;
    _min: TaskAttachmentMinAggregateOutputType | null;
    _max: TaskAttachmentMaxAggregateOutputType | null;
};
export type TaskAttachmentAvgAggregateOutputType = {
    size: number | null;
};
export type TaskAttachmentSumAggregateOutputType = {
    size: number | null;
};
export type TaskAttachmentMinAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    userId: string | null;
    name: string | null;
    type: string | null;
    size: number | null;
    dataUrl: string | null;
    createdAt: Date | null;
};
export type TaskAttachmentMaxAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    userId: string | null;
    name: string | null;
    type: string | null;
    size: number | null;
    dataUrl: string | null;
    createdAt: Date | null;
};
export type TaskAttachmentCountAggregateOutputType = {
    id: number;
    taskId: number;
    userId: number;
    name: number;
    type: number;
    size: number;
    dataUrl: number;
    createdAt: number;
    _all: number;
};
export type TaskAttachmentAvgAggregateInputType = {
    size?: true;
};
export type TaskAttachmentSumAggregateInputType = {
    size?: true;
};
export type TaskAttachmentMinAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    name?: true;
    type?: true;
    size?: true;
    dataUrl?: true;
    createdAt?: true;
};
export type TaskAttachmentMaxAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    name?: true;
    type?: true;
    size?: true;
    dataUrl?: true;
    createdAt?: true;
};
export type TaskAttachmentCountAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    name?: true;
    type?: true;
    size?: true;
    dataUrl?: true;
    createdAt?: true;
    _all?: true;
};
export type TaskAttachmentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskAttachmentWhereInput;
    orderBy?: Prisma.TaskAttachmentOrderByWithRelationInput | Prisma.TaskAttachmentOrderByWithRelationInput[];
    cursor?: Prisma.TaskAttachmentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TaskAttachmentCountAggregateInputType;
    _avg?: TaskAttachmentAvgAggregateInputType;
    _sum?: TaskAttachmentSumAggregateInputType;
    _min?: TaskAttachmentMinAggregateInputType;
    _max?: TaskAttachmentMaxAggregateInputType;
};
export type GetTaskAttachmentAggregateType<T extends TaskAttachmentAggregateArgs> = {
    [P in keyof T & keyof AggregateTaskAttachment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTaskAttachment[P]> : Prisma.GetScalarType<T[P], AggregateTaskAttachment[P]>;
};
export type TaskAttachmentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskAttachmentWhereInput;
    orderBy?: Prisma.TaskAttachmentOrderByWithAggregationInput | Prisma.TaskAttachmentOrderByWithAggregationInput[];
    by: Prisma.TaskAttachmentScalarFieldEnum[] | Prisma.TaskAttachmentScalarFieldEnum;
    having?: Prisma.TaskAttachmentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TaskAttachmentCountAggregateInputType | true;
    _avg?: TaskAttachmentAvgAggregateInputType;
    _sum?: TaskAttachmentSumAggregateInputType;
    _min?: TaskAttachmentMinAggregateInputType;
    _max?: TaskAttachmentMaxAggregateInputType;
};
export type TaskAttachmentGroupByOutputType = {
    id: string;
    taskId: string;
    userId: string;
    name: string;
    type: string;
    size: number;
    dataUrl: string;
    createdAt: Date;
    _count: TaskAttachmentCountAggregateOutputType | null;
    _avg: TaskAttachmentAvgAggregateOutputType | null;
    _sum: TaskAttachmentSumAggregateOutputType | null;
    _min: TaskAttachmentMinAggregateOutputType | null;
    _max: TaskAttachmentMaxAggregateOutputType | null;
};
export type GetTaskAttachmentGroupByPayload<T extends TaskAttachmentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TaskAttachmentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TaskAttachmentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TaskAttachmentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TaskAttachmentGroupByOutputType[P]>;
}>>;
export type TaskAttachmentWhereInput = {
    AND?: Prisma.TaskAttachmentWhereInput | Prisma.TaskAttachmentWhereInput[];
    OR?: Prisma.TaskAttachmentWhereInput[];
    NOT?: Prisma.TaskAttachmentWhereInput | Prisma.TaskAttachmentWhereInput[];
    id?: Prisma.StringFilter<"TaskAttachment"> | string;
    taskId?: Prisma.StringFilter<"TaskAttachment"> | string;
    userId?: Prisma.StringFilter<"TaskAttachment"> | string;
    name?: Prisma.StringFilter<"TaskAttachment"> | string;
    type?: Prisma.StringFilter<"TaskAttachment"> | string;
    size?: Prisma.IntFilter<"TaskAttachment"> | number;
    dataUrl?: Prisma.StringFilter<"TaskAttachment"> | string;
    createdAt?: Prisma.DateTimeFilter<"TaskAttachment"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type TaskAttachmentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    dataUrl?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    task?: Prisma.TaskOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    _relevance?: Prisma.TaskAttachmentOrderByRelevanceInput;
};
export type TaskAttachmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.TaskAttachmentWhereInput | Prisma.TaskAttachmentWhereInput[];
    OR?: Prisma.TaskAttachmentWhereInput[];
    NOT?: Prisma.TaskAttachmentWhereInput | Prisma.TaskAttachmentWhereInput[];
    taskId?: Prisma.StringFilter<"TaskAttachment"> | string;
    userId?: Prisma.StringFilter<"TaskAttachment"> | string;
    name?: Prisma.StringFilter<"TaskAttachment"> | string;
    type?: Prisma.StringFilter<"TaskAttachment"> | string;
    size?: Prisma.IntFilter<"TaskAttachment"> | number;
    dataUrl?: Prisma.StringFilter<"TaskAttachment"> | string;
    createdAt?: Prisma.DateTimeFilter<"TaskAttachment"> | Date | string;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type TaskAttachmentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    dataUrl?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.TaskAttachmentCountOrderByAggregateInput;
    _avg?: Prisma.TaskAttachmentAvgOrderByAggregateInput;
    _max?: Prisma.TaskAttachmentMaxOrderByAggregateInput;
    _min?: Prisma.TaskAttachmentMinOrderByAggregateInput;
    _sum?: Prisma.TaskAttachmentSumOrderByAggregateInput;
};
export type TaskAttachmentScalarWhereWithAggregatesInput = {
    AND?: Prisma.TaskAttachmentScalarWhereWithAggregatesInput | Prisma.TaskAttachmentScalarWhereWithAggregatesInput[];
    OR?: Prisma.TaskAttachmentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TaskAttachmentScalarWhereWithAggregatesInput | Prisma.TaskAttachmentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"TaskAttachment"> | string;
    taskId?: Prisma.StringWithAggregatesFilter<"TaskAttachment"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"TaskAttachment"> | string;
    name?: Prisma.StringWithAggregatesFilter<"TaskAttachment"> | string;
    type?: Prisma.StringWithAggregatesFilter<"TaskAttachment"> | string;
    size?: Prisma.IntWithAggregatesFilter<"TaskAttachment"> | number;
    dataUrl?: Prisma.StringWithAggregatesFilter<"TaskAttachment"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"TaskAttachment"> | Date | string;
};
export type TaskAttachmentCreateInput = {
    id?: string;
    name: string;
    type: string;
    size: number;
    dataUrl: string;
    createdAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutAttachmentsInput;
    user: Prisma.UserCreateNestedOneWithoutAttachmentsInput;
};
export type TaskAttachmentUncheckedCreateInput = {
    id?: string;
    taskId: string;
    userId: string;
    name: string;
    type: string;
    size: number;
    dataUrl: string;
    createdAt?: Date | string;
};
export type TaskAttachmentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    dataUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutAttachmentsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutAttachmentsNestedInput;
};
export type TaskAttachmentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    dataUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAttachmentCreateManyInput = {
    id?: string;
    taskId: string;
    userId: string;
    name: string;
    type: string;
    size: number;
    dataUrl: string;
    createdAt?: Date | string;
};
export type TaskAttachmentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    dataUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAttachmentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    dataUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAttachmentListRelationFilter = {
    every?: Prisma.TaskAttachmentWhereInput;
    some?: Prisma.TaskAttachmentWhereInput;
    none?: Prisma.TaskAttachmentWhereInput;
};
export type TaskAttachmentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TaskAttachmentOrderByRelevanceInput = {
    fields: Prisma.TaskAttachmentOrderByRelevanceFieldEnum | Prisma.TaskAttachmentOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type TaskAttachmentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    dataUrl?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TaskAttachmentAvgOrderByAggregateInput = {
    size?: Prisma.SortOrder;
};
export type TaskAttachmentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    dataUrl?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TaskAttachmentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    dataUrl?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TaskAttachmentSumOrderByAggregateInput = {
    size?: Prisma.SortOrder;
};
export type TaskAttachmentCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TaskAttachmentCreateWithoutUserInput, Prisma.TaskAttachmentUncheckedCreateWithoutUserInput> | Prisma.TaskAttachmentCreateWithoutUserInput[] | Prisma.TaskAttachmentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskAttachmentCreateOrConnectWithoutUserInput | Prisma.TaskAttachmentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TaskAttachmentCreateManyUserInputEnvelope;
    connect?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
};
export type TaskAttachmentUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TaskAttachmentCreateWithoutUserInput, Prisma.TaskAttachmentUncheckedCreateWithoutUserInput> | Prisma.TaskAttachmentCreateWithoutUserInput[] | Prisma.TaskAttachmentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskAttachmentCreateOrConnectWithoutUserInput | Prisma.TaskAttachmentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TaskAttachmentCreateManyUserInputEnvelope;
    connect?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
};
export type TaskAttachmentUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TaskAttachmentCreateWithoutUserInput, Prisma.TaskAttachmentUncheckedCreateWithoutUserInput> | Prisma.TaskAttachmentCreateWithoutUserInput[] | Prisma.TaskAttachmentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskAttachmentCreateOrConnectWithoutUserInput | Prisma.TaskAttachmentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TaskAttachmentUpsertWithWhereUniqueWithoutUserInput | Prisma.TaskAttachmentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TaskAttachmentCreateManyUserInputEnvelope;
    set?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    disconnect?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    delete?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    connect?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    update?: Prisma.TaskAttachmentUpdateWithWhereUniqueWithoutUserInput | Prisma.TaskAttachmentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TaskAttachmentUpdateManyWithWhereWithoutUserInput | Prisma.TaskAttachmentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TaskAttachmentScalarWhereInput | Prisma.TaskAttachmentScalarWhereInput[];
};
export type TaskAttachmentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TaskAttachmentCreateWithoutUserInput, Prisma.TaskAttachmentUncheckedCreateWithoutUserInput> | Prisma.TaskAttachmentCreateWithoutUserInput[] | Prisma.TaskAttachmentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskAttachmentCreateOrConnectWithoutUserInput | Prisma.TaskAttachmentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TaskAttachmentUpsertWithWhereUniqueWithoutUserInput | Prisma.TaskAttachmentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TaskAttachmentCreateManyUserInputEnvelope;
    set?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    disconnect?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    delete?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    connect?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    update?: Prisma.TaskAttachmentUpdateWithWhereUniqueWithoutUserInput | Prisma.TaskAttachmentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TaskAttachmentUpdateManyWithWhereWithoutUserInput | Prisma.TaskAttachmentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TaskAttachmentScalarWhereInput | Prisma.TaskAttachmentScalarWhereInput[];
};
export type TaskAttachmentCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TaskAttachmentCreateWithoutTaskInput, Prisma.TaskAttachmentUncheckedCreateWithoutTaskInput> | Prisma.TaskAttachmentCreateWithoutTaskInput[] | Prisma.TaskAttachmentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskAttachmentCreateOrConnectWithoutTaskInput | Prisma.TaskAttachmentCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TaskAttachmentCreateManyTaskInputEnvelope;
    connect?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
};
export type TaskAttachmentUncheckedCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TaskAttachmentCreateWithoutTaskInput, Prisma.TaskAttachmentUncheckedCreateWithoutTaskInput> | Prisma.TaskAttachmentCreateWithoutTaskInput[] | Prisma.TaskAttachmentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskAttachmentCreateOrConnectWithoutTaskInput | Prisma.TaskAttachmentCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TaskAttachmentCreateManyTaskInputEnvelope;
    connect?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
};
export type TaskAttachmentUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TaskAttachmentCreateWithoutTaskInput, Prisma.TaskAttachmentUncheckedCreateWithoutTaskInput> | Prisma.TaskAttachmentCreateWithoutTaskInput[] | Prisma.TaskAttachmentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskAttachmentCreateOrConnectWithoutTaskInput | Prisma.TaskAttachmentCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TaskAttachmentUpsertWithWhereUniqueWithoutTaskInput | Prisma.TaskAttachmentUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TaskAttachmentCreateManyTaskInputEnvelope;
    set?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    disconnect?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    delete?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    connect?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    update?: Prisma.TaskAttachmentUpdateWithWhereUniqueWithoutTaskInput | Prisma.TaskAttachmentUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TaskAttachmentUpdateManyWithWhereWithoutTaskInput | Prisma.TaskAttachmentUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TaskAttachmentScalarWhereInput | Prisma.TaskAttachmentScalarWhereInput[];
};
export type TaskAttachmentUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TaskAttachmentCreateWithoutTaskInput, Prisma.TaskAttachmentUncheckedCreateWithoutTaskInput> | Prisma.TaskAttachmentCreateWithoutTaskInput[] | Prisma.TaskAttachmentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskAttachmentCreateOrConnectWithoutTaskInput | Prisma.TaskAttachmentCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TaskAttachmentUpsertWithWhereUniqueWithoutTaskInput | Prisma.TaskAttachmentUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TaskAttachmentCreateManyTaskInputEnvelope;
    set?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    disconnect?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    delete?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    connect?: Prisma.TaskAttachmentWhereUniqueInput | Prisma.TaskAttachmentWhereUniqueInput[];
    update?: Prisma.TaskAttachmentUpdateWithWhereUniqueWithoutTaskInput | Prisma.TaskAttachmentUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TaskAttachmentUpdateManyWithWhereWithoutTaskInput | Prisma.TaskAttachmentUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TaskAttachmentScalarWhereInput | Prisma.TaskAttachmentScalarWhereInput[];
};
export type TaskAttachmentCreateWithoutUserInput = {
    id?: string;
    name: string;
    type: string;
    size: number;
    dataUrl: string;
    createdAt?: Date | string;
    task: Prisma.TaskCreateNestedOneWithoutAttachmentsInput;
};
export type TaskAttachmentUncheckedCreateWithoutUserInput = {
    id?: string;
    taskId: string;
    name: string;
    type: string;
    size: number;
    dataUrl: string;
    createdAt?: Date | string;
};
export type TaskAttachmentCreateOrConnectWithoutUserInput = {
    where: Prisma.TaskAttachmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskAttachmentCreateWithoutUserInput, Prisma.TaskAttachmentUncheckedCreateWithoutUserInput>;
};
export type TaskAttachmentCreateManyUserInputEnvelope = {
    data: Prisma.TaskAttachmentCreateManyUserInput | Prisma.TaskAttachmentCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type TaskAttachmentUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.TaskAttachmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskAttachmentUpdateWithoutUserInput, Prisma.TaskAttachmentUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TaskAttachmentCreateWithoutUserInput, Prisma.TaskAttachmentUncheckedCreateWithoutUserInput>;
};
export type TaskAttachmentUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.TaskAttachmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskAttachmentUpdateWithoutUserInput, Prisma.TaskAttachmentUncheckedUpdateWithoutUserInput>;
};
export type TaskAttachmentUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.TaskAttachmentScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskAttachmentUpdateManyMutationInput, Prisma.TaskAttachmentUncheckedUpdateManyWithoutUserInput>;
};
export type TaskAttachmentScalarWhereInput = {
    AND?: Prisma.TaskAttachmentScalarWhereInput | Prisma.TaskAttachmentScalarWhereInput[];
    OR?: Prisma.TaskAttachmentScalarWhereInput[];
    NOT?: Prisma.TaskAttachmentScalarWhereInput | Prisma.TaskAttachmentScalarWhereInput[];
    id?: Prisma.StringFilter<"TaskAttachment"> | string;
    taskId?: Prisma.StringFilter<"TaskAttachment"> | string;
    userId?: Prisma.StringFilter<"TaskAttachment"> | string;
    name?: Prisma.StringFilter<"TaskAttachment"> | string;
    type?: Prisma.StringFilter<"TaskAttachment"> | string;
    size?: Prisma.IntFilter<"TaskAttachment"> | number;
    dataUrl?: Prisma.StringFilter<"TaskAttachment"> | string;
    createdAt?: Prisma.DateTimeFilter<"TaskAttachment"> | Date | string;
};
export type TaskAttachmentCreateWithoutTaskInput = {
    id?: string;
    name: string;
    type: string;
    size: number;
    dataUrl: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutAttachmentsInput;
};
export type TaskAttachmentUncheckedCreateWithoutTaskInput = {
    id?: string;
    userId: string;
    name: string;
    type: string;
    size: number;
    dataUrl: string;
    createdAt?: Date | string;
};
export type TaskAttachmentCreateOrConnectWithoutTaskInput = {
    where: Prisma.TaskAttachmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskAttachmentCreateWithoutTaskInput, Prisma.TaskAttachmentUncheckedCreateWithoutTaskInput>;
};
export type TaskAttachmentCreateManyTaskInputEnvelope = {
    data: Prisma.TaskAttachmentCreateManyTaskInput | Prisma.TaskAttachmentCreateManyTaskInput[];
    skipDuplicates?: boolean;
};
export type TaskAttachmentUpsertWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TaskAttachmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskAttachmentUpdateWithoutTaskInput, Prisma.TaskAttachmentUncheckedUpdateWithoutTaskInput>;
    create: Prisma.XOR<Prisma.TaskAttachmentCreateWithoutTaskInput, Prisma.TaskAttachmentUncheckedCreateWithoutTaskInput>;
};
export type TaskAttachmentUpdateWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TaskAttachmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskAttachmentUpdateWithoutTaskInput, Prisma.TaskAttachmentUncheckedUpdateWithoutTaskInput>;
};
export type TaskAttachmentUpdateManyWithWhereWithoutTaskInput = {
    where: Prisma.TaskAttachmentScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskAttachmentUpdateManyMutationInput, Prisma.TaskAttachmentUncheckedUpdateManyWithoutTaskInput>;
};
export type TaskAttachmentCreateManyUserInput = {
    id?: string;
    taskId: string;
    name: string;
    type: string;
    size: number;
    dataUrl: string;
    createdAt?: Date | string;
};
export type TaskAttachmentUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    dataUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    task?: Prisma.TaskUpdateOneRequiredWithoutAttachmentsNestedInput;
};
export type TaskAttachmentUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    dataUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAttachmentUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    dataUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAttachmentCreateManyTaskInput = {
    id?: string;
    userId: string;
    name: string;
    type: string;
    size: number;
    dataUrl: string;
    createdAt?: Date | string;
};
export type TaskAttachmentUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    dataUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutAttachmentsNestedInput;
};
export type TaskAttachmentUncheckedUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    dataUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAttachmentUncheckedUpdateManyWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.IntFieldUpdateOperationsInput | number;
    dataUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskAttachmentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    name?: boolean;
    type?: boolean;
    size?: boolean;
    dataUrl?: boolean;
    createdAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["taskAttachment"]>;
export type TaskAttachmentSelectScalar = {
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    name?: boolean;
    type?: boolean;
    size?: boolean;
    dataUrl?: boolean;
    createdAt?: boolean;
};
export type TaskAttachmentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "taskId" | "userId" | "name" | "type" | "size" | "dataUrl" | "createdAt", ExtArgs["result"]["taskAttachment"]>;
export type TaskAttachmentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $TaskAttachmentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TaskAttachment";
    objects: {
        task: Prisma.$TaskPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        taskId: string;
        userId: string;
        name: string;
        type: string;
        size: number;
        dataUrl: string;
        createdAt: Date;
    }, ExtArgs["result"]["taskAttachment"]>;
    composites: {};
};
export type TaskAttachmentGetPayload<S extends boolean | null | undefined | TaskAttachmentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TaskAttachmentPayload, S>;
export type TaskAttachmentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TaskAttachmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TaskAttachmentCountAggregateInputType | true;
};
export interface TaskAttachmentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TaskAttachment'];
        meta: {
            name: 'TaskAttachment';
        };
    };
    findUnique<T extends TaskAttachmentFindUniqueArgs>(args: Prisma.SelectSubset<T, TaskAttachmentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TaskAttachmentClient<runtime.Types.Result.GetResult<Prisma.$TaskAttachmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TaskAttachmentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TaskAttachmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskAttachmentClient<runtime.Types.Result.GetResult<Prisma.$TaskAttachmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TaskAttachmentFindFirstArgs>(args?: Prisma.SelectSubset<T, TaskAttachmentFindFirstArgs<ExtArgs>>): Prisma.Prisma__TaskAttachmentClient<runtime.Types.Result.GetResult<Prisma.$TaskAttachmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TaskAttachmentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TaskAttachmentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskAttachmentClient<runtime.Types.Result.GetResult<Prisma.$TaskAttachmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TaskAttachmentFindManyArgs>(args?: Prisma.SelectSubset<T, TaskAttachmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskAttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TaskAttachmentCreateArgs>(args: Prisma.SelectSubset<T, TaskAttachmentCreateArgs<ExtArgs>>): Prisma.Prisma__TaskAttachmentClient<runtime.Types.Result.GetResult<Prisma.$TaskAttachmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TaskAttachmentCreateManyArgs>(args?: Prisma.SelectSubset<T, TaskAttachmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends TaskAttachmentDeleteArgs>(args: Prisma.SelectSubset<T, TaskAttachmentDeleteArgs<ExtArgs>>): Prisma.Prisma__TaskAttachmentClient<runtime.Types.Result.GetResult<Prisma.$TaskAttachmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TaskAttachmentUpdateArgs>(args: Prisma.SelectSubset<T, TaskAttachmentUpdateArgs<ExtArgs>>): Prisma.Prisma__TaskAttachmentClient<runtime.Types.Result.GetResult<Prisma.$TaskAttachmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TaskAttachmentDeleteManyArgs>(args?: Prisma.SelectSubset<T, TaskAttachmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TaskAttachmentUpdateManyArgs>(args: Prisma.SelectSubset<T, TaskAttachmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends TaskAttachmentUpsertArgs>(args: Prisma.SelectSubset<T, TaskAttachmentUpsertArgs<ExtArgs>>): Prisma.Prisma__TaskAttachmentClient<runtime.Types.Result.GetResult<Prisma.$TaskAttachmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TaskAttachmentCountArgs>(args?: Prisma.Subset<T, TaskAttachmentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TaskAttachmentCountAggregateOutputType> : number>;
    aggregate<T extends TaskAttachmentAggregateArgs>(args: Prisma.Subset<T, TaskAttachmentAggregateArgs>): Prisma.PrismaPromise<GetTaskAttachmentAggregateType<T>>;
    groupBy<T extends TaskAttachmentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TaskAttachmentGroupByArgs['orderBy'];
    } : {
        orderBy?: TaskAttachmentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TaskAttachmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskAttachmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TaskAttachmentFieldRefs;
}
export interface Prisma__TaskAttachmentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    task<T extends Prisma.TaskDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskDefaultArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TaskAttachmentFieldRefs {
    readonly id: Prisma.FieldRef<"TaskAttachment", 'String'>;
    readonly taskId: Prisma.FieldRef<"TaskAttachment", 'String'>;
    readonly userId: Prisma.FieldRef<"TaskAttachment", 'String'>;
    readonly name: Prisma.FieldRef<"TaskAttachment", 'String'>;
    readonly type: Prisma.FieldRef<"TaskAttachment", 'String'>;
    readonly size: Prisma.FieldRef<"TaskAttachment", 'Int'>;
    readonly dataUrl: Prisma.FieldRef<"TaskAttachment", 'String'>;
    readonly createdAt: Prisma.FieldRef<"TaskAttachment", 'DateTime'>;
}
export type TaskAttachmentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.TaskAttachmentOmit<ExtArgs> | null;
    include?: Prisma.TaskAttachmentInclude<ExtArgs> | null;
    where: Prisma.TaskAttachmentWhereUniqueInput;
};
export type TaskAttachmentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.TaskAttachmentOmit<ExtArgs> | null;
    include?: Prisma.TaskAttachmentInclude<ExtArgs> | null;
    where: Prisma.TaskAttachmentWhereUniqueInput;
};
export type TaskAttachmentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.TaskAttachmentOmit<ExtArgs> | null;
    include?: Prisma.TaskAttachmentInclude<ExtArgs> | null;
    where?: Prisma.TaskAttachmentWhereInput;
    orderBy?: Prisma.TaskAttachmentOrderByWithRelationInput | Prisma.TaskAttachmentOrderByWithRelationInput[];
    cursor?: Prisma.TaskAttachmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskAttachmentScalarFieldEnum | Prisma.TaskAttachmentScalarFieldEnum[];
};
export type TaskAttachmentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.TaskAttachmentOmit<ExtArgs> | null;
    include?: Prisma.TaskAttachmentInclude<ExtArgs> | null;
    where?: Prisma.TaskAttachmentWhereInput;
    orderBy?: Prisma.TaskAttachmentOrderByWithRelationInput | Prisma.TaskAttachmentOrderByWithRelationInput[];
    cursor?: Prisma.TaskAttachmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskAttachmentScalarFieldEnum | Prisma.TaskAttachmentScalarFieldEnum[];
};
export type TaskAttachmentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.TaskAttachmentOmit<ExtArgs> | null;
    include?: Prisma.TaskAttachmentInclude<ExtArgs> | null;
    where?: Prisma.TaskAttachmentWhereInput;
    orderBy?: Prisma.TaskAttachmentOrderByWithRelationInput | Prisma.TaskAttachmentOrderByWithRelationInput[];
    cursor?: Prisma.TaskAttachmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskAttachmentScalarFieldEnum | Prisma.TaskAttachmentScalarFieldEnum[];
};
export type TaskAttachmentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.TaskAttachmentOmit<ExtArgs> | null;
    include?: Prisma.TaskAttachmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskAttachmentCreateInput, Prisma.TaskAttachmentUncheckedCreateInput>;
};
export type TaskAttachmentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TaskAttachmentCreateManyInput | Prisma.TaskAttachmentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TaskAttachmentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.TaskAttachmentOmit<ExtArgs> | null;
    include?: Prisma.TaskAttachmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskAttachmentUpdateInput, Prisma.TaskAttachmentUncheckedUpdateInput>;
    where: Prisma.TaskAttachmentWhereUniqueInput;
};
export type TaskAttachmentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TaskAttachmentUpdateManyMutationInput, Prisma.TaskAttachmentUncheckedUpdateManyInput>;
    where?: Prisma.TaskAttachmentWhereInput;
    limit?: number;
};
export type TaskAttachmentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.TaskAttachmentOmit<ExtArgs> | null;
    include?: Prisma.TaskAttachmentInclude<ExtArgs> | null;
    where: Prisma.TaskAttachmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskAttachmentCreateInput, Prisma.TaskAttachmentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TaskAttachmentUpdateInput, Prisma.TaskAttachmentUncheckedUpdateInput>;
};
export type TaskAttachmentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.TaskAttachmentOmit<ExtArgs> | null;
    include?: Prisma.TaskAttachmentInclude<ExtArgs> | null;
    where: Prisma.TaskAttachmentWhereUniqueInput;
};
export type TaskAttachmentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskAttachmentWhereInput;
    limit?: number;
};
export type TaskAttachmentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskAttachmentSelect<ExtArgs> | null;
    omit?: Prisma.TaskAttachmentOmit<ExtArgs> | null;
    include?: Prisma.TaskAttachmentInclude<ExtArgs> | null;
};
