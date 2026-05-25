import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ModuleModel = runtime.Types.Result.DefaultSelection<Prisma.$ModulePayload>;
export type AggregateModule = {
    _count: ModuleCountAggregateOutputType | null;
    _avg: ModuleAvgAggregateOutputType | null;
    _sum: ModuleSumAggregateOutputType | null;
    _min: ModuleMinAggregateOutputType | null;
    _max: ModuleMaxAggregateOutputType | null;
};
export type ModuleAvgAggregateOutputType = {
    order: number | null;
    progress: number | null;
};
export type ModuleSumAggregateOutputType = {
    order: number | null;
    progress: number | null;
};
export type ModuleMinAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    name: string | null;
    description: string | null;
    order: number | null;
    progress: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ModuleMaxAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    name: string | null;
    description: string | null;
    order: number | null;
    progress: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ModuleCountAggregateOutputType = {
    id: number;
    projectId: number;
    name: number;
    description: number;
    order: number;
    progress: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ModuleAvgAggregateInputType = {
    order?: true;
    progress?: true;
};
export type ModuleSumAggregateInputType = {
    order?: true;
    progress?: true;
};
export type ModuleMinAggregateInputType = {
    id?: true;
    projectId?: true;
    name?: true;
    description?: true;
    order?: true;
    progress?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ModuleMaxAggregateInputType = {
    id?: true;
    projectId?: true;
    name?: true;
    description?: true;
    order?: true;
    progress?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ModuleCountAggregateInputType = {
    id?: true;
    projectId?: true;
    name?: true;
    description?: true;
    order?: true;
    progress?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ModuleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModuleWhereInput;
    orderBy?: Prisma.ModuleOrderByWithRelationInput | Prisma.ModuleOrderByWithRelationInput[];
    cursor?: Prisma.ModuleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ModuleCountAggregateInputType;
    _avg?: ModuleAvgAggregateInputType;
    _sum?: ModuleSumAggregateInputType;
    _min?: ModuleMinAggregateInputType;
    _max?: ModuleMaxAggregateInputType;
};
export type GetModuleAggregateType<T extends ModuleAggregateArgs> = {
    [P in keyof T & keyof AggregateModule]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateModule[P]> : Prisma.GetScalarType<T[P], AggregateModule[P]>;
};
export type ModuleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModuleWhereInput;
    orderBy?: Prisma.ModuleOrderByWithAggregationInput | Prisma.ModuleOrderByWithAggregationInput[];
    by: Prisma.ModuleScalarFieldEnum[] | Prisma.ModuleScalarFieldEnum;
    having?: Prisma.ModuleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ModuleCountAggregateInputType | true;
    _avg?: ModuleAvgAggregateInputType;
    _sum?: ModuleSumAggregateInputType;
    _min?: ModuleMinAggregateInputType;
    _max?: ModuleMaxAggregateInputType;
};
export type ModuleGroupByOutputType = {
    id: string;
    projectId: string;
    name: string;
    description: string;
    order: number;
    progress: number;
    createdAt: Date;
    updatedAt: Date;
    _count: ModuleCountAggregateOutputType | null;
    _avg: ModuleAvgAggregateOutputType | null;
    _sum: ModuleSumAggregateOutputType | null;
    _min: ModuleMinAggregateOutputType | null;
    _max: ModuleMaxAggregateOutputType | null;
};
export type GetModuleGroupByPayload<T extends ModuleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ModuleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ModuleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ModuleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ModuleGroupByOutputType[P]>;
}>>;
export type ModuleWhereInput = {
    AND?: Prisma.ModuleWhereInput | Prisma.ModuleWhereInput[];
    OR?: Prisma.ModuleWhereInput[];
    NOT?: Prisma.ModuleWhereInput | Prisma.ModuleWhereInput[];
    id?: Prisma.StringFilter<"Module"> | string;
    projectId?: Prisma.StringFilter<"Module"> | string;
    name?: Prisma.StringFilter<"Module"> | string;
    description?: Prisma.StringFilter<"Module"> | string;
    order?: Prisma.IntFilter<"Module"> | number;
    progress?: Prisma.IntFilter<"Module"> | number;
    createdAt?: Prisma.DateTimeFilter<"Module"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Module"> | Date | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    epics?: Prisma.EpicListRelationFilter;
    tasks?: Prisma.TaskListRelationFilter;
};
export type ModuleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    project?: Prisma.ProjectOrderByWithRelationInput;
    epics?: Prisma.EpicOrderByRelationAggregateInput;
    tasks?: Prisma.TaskOrderByRelationAggregateInput;
    _relevance?: Prisma.ModuleOrderByRelevanceInput;
};
export type ModuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ModuleWhereInput | Prisma.ModuleWhereInput[];
    OR?: Prisma.ModuleWhereInput[];
    NOT?: Prisma.ModuleWhereInput | Prisma.ModuleWhereInput[];
    projectId?: Prisma.StringFilter<"Module"> | string;
    name?: Prisma.StringFilter<"Module"> | string;
    description?: Prisma.StringFilter<"Module"> | string;
    order?: Prisma.IntFilter<"Module"> | number;
    progress?: Prisma.IntFilter<"Module"> | number;
    createdAt?: Prisma.DateTimeFilter<"Module"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Module"> | Date | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    epics?: Prisma.EpicListRelationFilter;
    tasks?: Prisma.TaskListRelationFilter;
}, "id">;
export type ModuleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ModuleCountOrderByAggregateInput;
    _avg?: Prisma.ModuleAvgOrderByAggregateInput;
    _max?: Prisma.ModuleMaxOrderByAggregateInput;
    _min?: Prisma.ModuleMinOrderByAggregateInput;
    _sum?: Prisma.ModuleSumOrderByAggregateInput;
};
export type ModuleScalarWhereWithAggregatesInput = {
    AND?: Prisma.ModuleScalarWhereWithAggregatesInput | Prisma.ModuleScalarWhereWithAggregatesInput[];
    OR?: Prisma.ModuleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ModuleScalarWhereWithAggregatesInput | Prisma.ModuleScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Module"> | string;
    projectId?: Prisma.StringWithAggregatesFilter<"Module"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Module"> | string;
    description?: Prisma.StringWithAggregatesFilter<"Module"> | string;
    order?: Prisma.IntWithAggregatesFilter<"Module"> | number;
    progress?: Prisma.IntWithAggregatesFilter<"Module"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Module"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Module"> | Date | string;
};
export type ModuleCreateInput = {
    id?: string;
    name: string;
    description: string;
    order?: number;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    project: Prisma.ProjectCreateNestedOneWithoutModulesInput;
    epics?: Prisma.EpicCreateNestedManyWithoutModuleInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutModuleInput;
};
export type ModuleUncheckedCreateInput = {
    id?: string;
    projectId: string;
    name: string;
    description: string;
    order?: number;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    epics?: Prisma.EpicUncheckedCreateNestedManyWithoutModuleInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutModuleInput;
};
export type ModuleUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    project?: Prisma.ProjectUpdateOneRequiredWithoutModulesNestedInput;
    epics?: Prisma.EpicUpdateManyWithoutModuleNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutModuleNestedInput;
};
export type ModuleUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    epics?: Prisma.EpicUncheckedUpdateManyWithoutModuleNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutModuleNestedInput;
};
export type ModuleCreateManyInput = {
    id?: string;
    projectId: string;
    name: string;
    description: string;
    order?: number;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ModuleUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModuleUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModuleListRelationFilter = {
    every?: Prisma.ModuleWhereInput;
    some?: Prisma.ModuleWhereInput;
    none?: Prisma.ModuleWhereInput;
};
export type ModuleOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ModuleOrderByRelevanceInput = {
    fields: Prisma.ModuleOrderByRelevanceFieldEnum | Prisma.ModuleOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type ModuleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ModuleAvgOrderByAggregateInput = {
    order?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
};
export type ModuleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ModuleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ModuleSumOrderByAggregateInput = {
    order?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
};
export type ModuleScalarRelationFilter = {
    is?: Prisma.ModuleWhereInput;
    isNot?: Prisma.ModuleWhereInput;
};
export type ModuleCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ModuleCreateWithoutProjectInput, Prisma.ModuleUncheckedCreateWithoutProjectInput> | Prisma.ModuleCreateWithoutProjectInput[] | Prisma.ModuleUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutProjectInput | Prisma.ModuleCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ModuleCreateManyProjectInputEnvelope;
    connect?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[];
};
export type ModuleUncheckedCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ModuleCreateWithoutProjectInput, Prisma.ModuleUncheckedCreateWithoutProjectInput> | Prisma.ModuleCreateWithoutProjectInput[] | Prisma.ModuleUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutProjectInput | Prisma.ModuleCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ModuleCreateManyProjectInputEnvelope;
    connect?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[];
};
export type ModuleUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ModuleCreateWithoutProjectInput, Prisma.ModuleUncheckedCreateWithoutProjectInput> | Prisma.ModuleCreateWithoutProjectInput[] | Prisma.ModuleUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutProjectInput | Prisma.ModuleCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ModuleUpsertWithWhereUniqueWithoutProjectInput | Prisma.ModuleUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ModuleCreateManyProjectInputEnvelope;
    set?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[];
    disconnect?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[];
    delete?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[];
    connect?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[];
    update?: Prisma.ModuleUpdateWithWhereUniqueWithoutProjectInput | Prisma.ModuleUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ModuleUpdateManyWithWhereWithoutProjectInput | Prisma.ModuleUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ModuleScalarWhereInput | Prisma.ModuleScalarWhereInput[];
};
export type ModuleUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ModuleCreateWithoutProjectInput, Prisma.ModuleUncheckedCreateWithoutProjectInput> | Prisma.ModuleCreateWithoutProjectInput[] | Prisma.ModuleUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutProjectInput | Prisma.ModuleCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ModuleUpsertWithWhereUniqueWithoutProjectInput | Prisma.ModuleUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ModuleCreateManyProjectInputEnvelope;
    set?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[];
    disconnect?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[];
    delete?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[];
    connect?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[];
    update?: Prisma.ModuleUpdateWithWhereUniqueWithoutProjectInput | Prisma.ModuleUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ModuleUpdateManyWithWhereWithoutProjectInput | Prisma.ModuleUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ModuleScalarWhereInput | Prisma.ModuleScalarWhereInput[];
};
export type ModuleCreateNestedOneWithoutEpicsInput = {
    create?: Prisma.XOR<Prisma.ModuleCreateWithoutEpicsInput, Prisma.ModuleUncheckedCreateWithoutEpicsInput>;
    connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutEpicsInput;
    connect?: Prisma.ModuleWhereUniqueInput;
};
export type ModuleUpdateOneRequiredWithoutEpicsNestedInput = {
    create?: Prisma.XOR<Prisma.ModuleCreateWithoutEpicsInput, Prisma.ModuleUncheckedCreateWithoutEpicsInput>;
    connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutEpicsInput;
    upsert?: Prisma.ModuleUpsertWithoutEpicsInput;
    connect?: Prisma.ModuleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ModuleUpdateToOneWithWhereWithoutEpicsInput, Prisma.ModuleUpdateWithoutEpicsInput>, Prisma.ModuleUncheckedUpdateWithoutEpicsInput>;
};
export type ModuleCreateNestedOneWithoutTasksInput = {
    create?: Prisma.XOR<Prisma.ModuleCreateWithoutTasksInput, Prisma.ModuleUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutTasksInput;
    connect?: Prisma.ModuleWhereUniqueInput;
};
export type ModuleUpdateOneRequiredWithoutTasksNestedInput = {
    create?: Prisma.XOR<Prisma.ModuleCreateWithoutTasksInput, Prisma.ModuleUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutTasksInput;
    upsert?: Prisma.ModuleUpsertWithoutTasksInput;
    connect?: Prisma.ModuleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ModuleUpdateToOneWithWhereWithoutTasksInput, Prisma.ModuleUpdateWithoutTasksInput>, Prisma.ModuleUncheckedUpdateWithoutTasksInput>;
};
export type ModuleCreateWithoutProjectInput = {
    id?: string;
    name: string;
    description: string;
    order?: number;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    epics?: Prisma.EpicCreateNestedManyWithoutModuleInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutModuleInput;
};
export type ModuleUncheckedCreateWithoutProjectInput = {
    id?: string;
    name: string;
    description: string;
    order?: number;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    epics?: Prisma.EpicUncheckedCreateNestedManyWithoutModuleInput;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutModuleInput;
};
export type ModuleCreateOrConnectWithoutProjectInput = {
    where: Prisma.ModuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ModuleCreateWithoutProjectInput, Prisma.ModuleUncheckedCreateWithoutProjectInput>;
};
export type ModuleCreateManyProjectInputEnvelope = {
    data: Prisma.ModuleCreateManyProjectInput | Prisma.ModuleCreateManyProjectInput[];
    skipDuplicates?: boolean;
};
export type ModuleUpsertWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ModuleWhereUniqueInput;
    update: Prisma.XOR<Prisma.ModuleUpdateWithoutProjectInput, Prisma.ModuleUncheckedUpdateWithoutProjectInput>;
    create: Prisma.XOR<Prisma.ModuleCreateWithoutProjectInput, Prisma.ModuleUncheckedCreateWithoutProjectInput>;
};
export type ModuleUpdateWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ModuleWhereUniqueInput;
    data: Prisma.XOR<Prisma.ModuleUpdateWithoutProjectInput, Prisma.ModuleUncheckedUpdateWithoutProjectInput>;
};
export type ModuleUpdateManyWithWhereWithoutProjectInput = {
    where: Prisma.ModuleScalarWhereInput;
    data: Prisma.XOR<Prisma.ModuleUpdateManyMutationInput, Prisma.ModuleUncheckedUpdateManyWithoutProjectInput>;
};
export type ModuleScalarWhereInput = {
    AND?: Prisma.ModuleScalarWhereInput | Prisma.ModuleScalarWhereInput[];
    OR?: Prisma.ModuleScalarWhereInput[];
    NOT?: Prisma.ModuleScalarWhereInput | Prisma.ModuleScalarWhereInput[];
    id?: Prisma.StringFilter<"Module"> | string;
    projectId?: Prisma.StringFilter<"Module"> | string;
    name?: Prisma.StringFilter<"Module"> | string;
    description?: Prisma.StringFilter<"Module"> | string;
    order?: Prisma.IntFilter<"Module"> | number;
    progress?: Prisma.IntFilter<"Module"> | number;
    createdAt?: Prisma.DateTimeFilter<"Module"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Module"> | Date | string;
};
export type ModuleCreateWithoutEpicsInput = {
    id?: string;
    name: string;
    description: string;
    order?: number;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    project: Prisma.ProjectCreateNestedOneWithoutModulesInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutModuleInput;
};
export type ModuleUncheckedCreateWithoutEpicsInput = {
    id?: string;
    projectId: string;
    name: string;
    description: string;
    order?: number;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutModuleInput;
};
export type ModuleCreateOrConnectWithoutEpicsInput = {
    where: Prisma.ModuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ModuleCreateWithoutEpicsInput, Prisma.ModuleUncheckedCreateWithoutEpicsInput>;
};
export type ModuleUpsertWithoutEpicsInput = {
    update: Prisma.XOR<Prisma.ModuleUpdateWithoutEpicsInput, Prisma.ModuleUncheckedUpdateWithoutEpicsInput>;
    create: Prisma.XOR<Prisma.ModuleCreateWithoutEpicsInput, Prisma.ModuleUncheckedCreateWithoutEpicsInput>;
    where?: Prisma.ModuleWhereInput;
};
export type ModuleUpdateToOneWithWhereWithoutEpicsInput = {
    where?: Prisma.ModuleWhereInput;
    data: Prisma.XOR<Prisma.ModuleUpdateWithoutEpicsInput, Prisma.ModuleUncheckedUpdateWithoutEpicsInput>;
};
export type ModuleUpdateWithoutEpicsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    project?: Prisma.ProjectUpdateOneRequiredWithoutModulesNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutModuleNestedInput;
};
export type ModuleUncheckedUpdateWithoutEpicsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutModuleNestedInput;
};
export type ModuleCreateWithoutTasksInput = {
    id?: string;
    name: string;
    description: string;
    order?: number;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    project: Prisma.ProjectCreateNestedOneWithoutModulesInput;
    epics?: Prisma.EpicCreateNestedManyWithoutModuleInput;
};
export type ModuleUncheckedCreateWithoutTasksInput = {
    id?: string;
    projectId: string;
    name: string;
    description: string;
    order?: number;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    epics?: Prisma.EpicUncheckedCreateNestedManyWithoutModuleInput;
};
export type ModuleCreateOrConnectWithoutTasksInput = {
    where: Prisma.ModuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ModuleCreateWithoutTasksInput, Prisma.ModuleUncheckedCreateWithoutTasksInput>;
};
export type ModuleUpsertWithoutTasksInput = {
    update: Prisma.XOR<Prisma.ModuleUpdateWithoutTasksInput, Prisma.ModuleUncheckedUpdateWithoutTasksInput>;
    create: Prisma.XOR<Prisma.ModuleCreateWithoutTasksInput, Prisma.ModuleUncheckedCreateWithoutTasksInput>;
    where?: Prisma.ModuleWhereInput;
};
export type ModuleUpdateToOneWithWhereWithoutTasksInput = {
    where?: Prisma.ModuleWhereInput;
    data: Prisma.XOR<Prisma.ModuleUpdateWithoutTasksInput, Prisma.ModuleUncheckedUpdateWithoutTasksInput>;
};
export type ModuleUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    project?: Prisma.ProjectUpdateOneRequiredWithoutModulesNestedInput;
    epics?: Prisma.EpicUpdateManyWithoutModuleNestedInput;
};
export type ModuleUncheckedUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    epics?: Prisma.EpicUncheckedUpdateManyWithoutModuleNestedInput;
};
export type ModuleCreateManyProjectInput = {
    id?: string;
    name: string;
    description: string;
    order?: number;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ModuleUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    epics?: Prisma.EpicUpdateManyWithoutModuleNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutModuleNestedInput;
};
export type ModuleUncheckedUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    epics?: Prisma.EpicUncheckedUpdateManyWithoutModuleNestedInput;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutModuleNestedInput;
};
export type ModuleUncheckedUpdateManyWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ModuleCountOutputType = {
    epics: number;
    tasks: number;
};
export type ModuleCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    epics?: boolean | ModuleCountOutputTypeCountEpicsArgs;
    tasks?: boolean | ModuleCountOutputTypeCountTasksArgs;
};
export type ModuleCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleCountOutputTypeSelect<ExtArgs> | null;
};
export type ModuleCountOutputTypeCountEpicsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EpicWhereInput;
};
export type ModuleCountOutputTypeCountTasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskWhereInput;
};
export type ModuleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    name?: boolean;
    description?: boolean;
    order?: boolean;
    progress?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    epics?: boolean | Prisma.Module$epicsArgs<ExtArgs>;
    tasks?: boolean | Prisma.Module$tasksArgs<ExtArgs>;
    _count?: boolean | Prisma.ModuleCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["module"]>;
export type ModuleSelectScalar = {
    id?: boolean;
    projectId?: boolean;
    name?: boolean;
    description?: boolean;
    order?: boolean;
    progress?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ModuleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "projectId" | "name" | "description" | "order" | "progress" | "createdAt" | "updatedAt", ExtArgs["result"]["module"]>;
export type ModuleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    epics?: boolean | Prisma.Module$epicsArgs<ExtArgs>;
    tasks?: boolean | Prisma.Module$tasksArgs<ExtArgs>;
    _count?: boolean | Prisma.ModuleCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $ModulePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Module";
    objects: {
        project: Prisma.$ProjectPayload<ExtArgs>;
        epics: Prisma.$EpicPayload<ExtArgs>[];
        tasks: Prisma.$TaskPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        projectId: string;
        name: string;
        description: string;
        order: number;
        progress: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["module"]>;
    composites: {};
};
export type ModuleGetPayload<S extends boolean | null | undefined | ModuleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ModulePayload, S>;
export type ModuleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ModuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ModuleCountAggregateInputType | true;
};
export interface ModuleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Module'];
        meta: {
            name: 'Module';
        };
    };
    findUnique<T extends ModuleFindUniqueArgs>(args: Prisma.SelectSubset<T, ModuleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ModuleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ModuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ModuleFindFirstArgs>(args?: Prisma.SelectSubset<T, ModuleFindFirstArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ModuleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ModuleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ModuleFindManyArgs>(args?: Prisma.SelectSubset<T, ModuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ModuleCreateArgs>(args: Prisma.SelectSubset<T, ModuleCreateArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ModuleCreateManyArgs>(args?: Prisma.SelectSubset<T, ModuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends ModuleDeleteArgs>(args: Prisma.SelectSubset<T, ModuleDeleteArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ModuleUpdateArgs>(args: Prisma.SelectSubset<T, ModuleUpdateArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ModuleDeleteManyArgs>(args?: Prisma.SelectSubset<T, ModuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ModuleUpdateManyArgs>(args: Prisma.SelectSubset<T, ModuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends ModuleUpsertArgs>(args: Prisma.SelectSubset<T, ModuleUpsertArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ModuleCountArgs>(args?: Prisma.Subset<T, ModuleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ModuleCountAggregateOutputType> : number>;
    aggregate<T extends ModuleAggregateArgs>(args: Prisma.Subset<T, ModuleAggregateArgs>): Prisma.PrismaPromise<GetModuleAggregateType<T>>;
    groupBy<T extends ModuleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ModuleGroupByArgs['orderBy'];
    } : {
        orderBy?: ModuleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ModuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ModuleFieldRefs;
}
export interface Prisma__ModuleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    project<T extends Prisma.ProjectDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProjectDefaultArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    epics<T extends Prisma.Module$epicsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Module$epicsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EpicPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    tasks<T extends Prisma.Module$tasksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Module$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ModuleFieldRefs {
    readonly id: Prisma.FieldRef<"Module", 'String'>;
    readonly projectId: Prisma.FieldRef<"Module", 'String'>;
    readonly name: Prisma.FieldRef<"Module", 'String'>;
    readonly description: Prisma.FieldRef<"Module", 'String'>;
    readonly order: Prisma.FieldRef<"Module", 'Int'>;
    readonly progress: Prisma.FieldRef<"Module", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Module", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Module", 'DateTime'>;
}
export type ModuleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where: Prisma.ModuleWhereUniqueInput;
};
export type ModuleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where: Prisma.ModuleWhereUniqueInput;
};
export type ModuleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where?: Prisma.ModuleWhereInput;
    orderBy?: Prisma.ModuleOrderByWithRelationInput | Prisma.ModuleOrderByWithRelationInput[];
    cursor?: Prisma.ModuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ModuleScalarFieldEnum | Prisma.ModuleScalarFieldEnum[];
};
export type ModuleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where?: Prisma.ModuleWhereInput;
    orderBy?: Prisma.ModuleOrderByWithRelationInput | Prisma.ModuleOrderByWithRelationInput[];
    cursor?: Prisma.ModuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ModuleScalarFieldEnum | Prisma.ModuleScalarFieldEnum[];
};
export type ModuleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where?: Prisma.ModuleWhereInput;
    orderBy?: Prisma.ModuleOrderByWithRelationInput | Prisma.ModuleOrderByWithRelationInput[];
    cursor?: Prisma.ModuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ModuleScalarFieldEnum | Prisma.ModuleScalarFieldEnum[];
};
export type ModuleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ModuleCreateInput, Prisma.ModuleUncheckedCreateInput>;
};
export type ModuleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ModuleCreateManyInput | Prisma.ModuleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ModuleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ModuleUpdateInput, Prisma.ModuleUncheckedUpdateInput>;
    where: Prisma.ModuleWhereUniqueInput;
};
export type ModuleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ModuleUpdateManyMutationInput, Prisma.ModuleUncheckedUpdateManyInput>;
    where?: Prisma.ModuleWhereInput;
    limit?: number;
};
export type ModuleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where: Prisma.ModuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ModuleCreateInput, Prisma.ModuleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ModuleUpdateInput, Prisma.ModuleUncheckedUpdateInput>;
};
export type ModuleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
    where: Prisma.ModuleWhereUniqueInput;
};
export type ModuleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ModuleWhereInput;
    limit?: number;
};
export type Module$epicsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EpicSelect<ExtArgs> | null;
    omit?: Prisma.EpicOmit<ExtArgs> | null;
    include?: Prisma.EpicInclude<ExtArgs> | null;
    where?: Prisma.EpicWhereInput;
    orderBy?: Prisma.EpicOrderByWithRelationInput | Prisma.EpicOrderByWithRelationInput[];
    cursor?: Prisma.EpicWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EpicScalarFieldEnum | Prisma.EpicScalarFieldEnum[];
};
export type Module$tasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput | Prisma.TaskOrderByWithRelationInput[];
    cursor?: Prisma.TaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskScalarFieldEnum | Prisma.TaskScalarFieldEnum[];
};
export type ModuleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ModuleSelect<ExtArgs> | null;
    omit?: Prisma.ModuleOmit<ExtArgs> | null;
    include?: Prisma.ModuleInclude<ExtArgs> | null;
};
