import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EpicModel = runtime.Types.Result.DefaultSelection<Prisma.$EpicPayload>;
export type AggregateEpic = {
    _count: EpicCountAggregateOutputType | null;
    _avg: EpicAvgAggregateOutputType | null;
    _sum: EpicSumAggregateOutputType | null;
    _min: EpicMinAggregateOutputType | null;
    _max: EpicMaxAggregateOutputType | null;
};
export type EpicAvgAggregateOutputType = {
    progress: number | null;
};
export type EpicSumAggregateOutputType = {
    progress: number | null;
};
export type EpicMinAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    moduleId: string | null;
    name: string | null;
    description: string | null;
    status: $Enums.ProjectStatus | null;
    startDate: Date | null;
    endDate: Date | null;
    progress: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EpicMaxAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    moduleId: string | null;
    name: string | null;
    description: string | null;
    status: $Enums.ProjectStatus | null;
    startDate: Date | null;
    endDate: Date | null;
    progress: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EpicCountAggregateOutputType = {
    id: number;
    projectId: number;
    moduleId: number;
    name: number;
    description: number;
    status: number;
    startDate: number;
    endDate: number;
    progress: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type EpicAvgAggregateInputType = {
    progress?: true;
};
export type EpicSumAggregateInputType = {
    progress?: true;
};
export type EpicMinAggregateInputType = {
    id?: true;
    projectId?: true;
    moduleId?: true;
    name?: true;
    description?: true;
    status?: true;
    startDate?: true;
    endDate?: true;
    progress?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EpicMaxAggregateInputType = {
    id?: true;
    projectId?: true;
    moduleId?: true;
    name?: true;
    description?: true;
    status?: true;
    startDate?: true;
    endDate?: true;
    progress?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EpicCountAggregateInputType = {
    id?: true;
    projectId?: true;
    moduleId?: true;
    name?: true;
    description?: true;
    status?: true;
    startDate?: true;
    endDate?: true;
    progress?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type EpicAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EpicWhereInput;
    orderBy?: Prisma.EpicOrderByWithRelationInput | Prisma.EpicOrderByWithRelationInput[];
    cursor?: Prisma.EpicWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EpicCountAggregateInputType;
    _avg?: EpicAvgAggregateInputType;
    _sum?: EpicSumAggregateInputType;
    _min?: EpicMinAggregateInputType;
    _max?: EpicMaxAggregateInputType;
};
export type GetEpicAggregateType<T extends EpicAggregateArgs> = {
    [P in keyof T & keyof AggregateEpic]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEpic[P]> : Prisma.GetScalarType<T[P], AggregateEpic[P]>;
};
export type EpicGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EpicWhereInput;
    orderBy?: Prisma.EpicOrderByWithAggregationInput | Prisma.EpicOrderByWithAggregationInput[];
    by: Prisma.EpicScalarFieldEnum[] | Prisma.EpicScalarFieldEnum;
    having?: Prisma.EpicScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EpicCountAggregateInputType | true;
    _avg?: EpicAvgAggregateInputType;
    _sum?: EpicSumAggregateInputType;
    _min?: EpicMinAggregateInputType;
    _max?: EpicMaxAggregateInputType;
};
export type EpicGroupByOutputType = {
    id: string;
    projectId: string;
    moduleId: string;
    name: string;
    description: string;
    status: $Enums.ProjectStatus;
    startDate: Date;
    endDate: Date | null;
    progress: number;
    createdAt: Date;
    updatedAt: Date;
    _count: EpicCountAggregateOutputType | null;
    _avg: EpicAvgAggregateOutputType | null;
    _sum: EpicSumAggregateOutputType | null;
    _min: EpicMinAggregateOutputType | null;
    _max: EpicMaxAggregateOutputType | null;
};
export type GetEpicGroupByPayload<T extends EpicGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EpicGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EpicGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EpicGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EpicGroupByOutputType[P]>;
}>>;
export type EpicWhereInput = {
    AND?: Prisma.EpicWhereInput | Prisma.EpicWhereInput[];
    OR?: Prisma.EpicWhereInput[];
    NOT?: Prisma.EpicWhereInput | Prisma.EpicWhereInput[];
    id?: Prisma.StringFilter<"Epic"> | string;
    projectId?: Prisma.StringFilter<"Epic"> | string;
    moduleId?: Prisma.StringFilter<"Epic"> | string;
    name?: Prisma.StringFilter<"Epic"> | string;
    description?: Prisma.StringFilter<"Epic"> | string;
    status?: Prisma.EnumProjectStatusFilter<"Epic"> | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFilter<"Epic"> | Date | string;
    endDate?: Prisma.DateTimeNullableFilter<"Epic"> | Date | string | null;
    progress?: Prisma.IntFilter<"Epic"> | number;
    createdAt?: Prisma.DateTimeFilter<"Epic"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Epic"> | Date | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    module?: Prisma.XOR<Prisma.ModuleScalarRelationFilter, Prisma.ModuleWhereInput>;
    tasks?: Prisma.TaskListRelationFilter;
};
export type EpicOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    project?: Prisma.ProjectOrderByWithRelationInput;
    module?: Prisma.ModuleOrderByWithRelationInput;
    tasks?: Prisma.TaskOrderByRelationAggregateInput;
    _relevance?: Prisma.EpicOrderByRelevanceInput;
};
export type EpicWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.EpicWhereInput | Prisma.EpicWhereInput[];
    OR?: Prisma.EpicWhereInput[];
    NOT?: Prisma.EpicWhereInput | Prisma.EpicWhereInput[];
    projectId?: Prisma.StringFilter<"Epic"> | string;
    moduleId?: Prisma.StringFilter<"Epic"> | string;
    name?: Prisma.StringFilter<"Epic"> | string;
    description?: Prisma.StringFilter<"Epic"> | string;
    status?: Prisma.EnumProjectStatusFilter<"Epic"> | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFilter<"Epic"> | Date | string;
    endDate?: Prisma.DateTimeNullableFilter<"Epic"> | Date | string | null;
    progress?: Prisma.IntFilter<"Epic"> | number;
    createdAt?: Prisma.DateTimeFilter<"Epic"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Epic"> | Date | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    module?: Prisma.XOR<Prisma.ModuleScalarRelationFilter, Prisma.ModuleWhereInput>;
    tasks?: Prisma.TaskListRelationFilter;
}, "id">;
export type EpicOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.EpicCountOrderByAggregateInput;
    _avg?: Prisma.EpicAvgOrderByAggregateInput;
    _max?: Prisma.EpicMaxOrderByAggregateInput;
    _min?: Prisma.EpicMinOrderByAggregateInput;
    _sum?: Prisma.EpicSumOrderByAggregateInput;
};
export type EpicScalarWhereWithAggregatesInput = {
    AND?: Prisma.EpicScalarWhereWithAggregatesInput | Prisma.EpicScalarWhereWithAggregatesInput[];
    OR?: Prisma.EpicScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EpicScalarWhereWithAggregatesInput | Prisma.EpicScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Epic"> | string;
    projectId?: Prisma.StringWithAggregatesFilter<"Epic"> | string;
    moduleId?: Prisma.StringWithAggregatesFilter<"Epic"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Epic"> | string;
    description?: Prisma.StringWithAggregatesFilter<"Epic"> | string;
    status?: Prisma.EnumProjectStatusWithAggregatesFilter<"Epic"> | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeWithAggregatesFilter<"Epic"> | Date | string;
    endDate?: Prisma.DateTimeNullableWithAggregatesFilter<"Epic"> | Date | string | null;
    progress?: Prisma.IntWithAggregatesFilter<"Epic"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Epic"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Epic"> | Date | string;
};
export type EpicCreateInput = {
    id?: string;
    name: string;
    description: string;
    status?: $Enums.ProjectStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    project: Prisma.ProjectCreateNestedOneWithoutEpicsInput;
    module: Prisma.ModuleCreateNestedOneWithoutEpicsInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutEpicInput;
};
export type EpicUncheckedCreateInput = {
    id?: string;
    projectId: string;
    moduleId: string;
    name: string;
    description: string;
    status?: $Enums.ProjectStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutEpicInput;
};
export type EpicUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    project?: Prisma.ProjectUpdateOneRequiredWithoutEpicsNestedInput;
    module?: Prisma.ModuleUpdateOneRequiredWithoutEpicsNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutEpicNestedInput;
};
export type EpicUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutEpicNestedInput;
};
export type EpicCreateManyInput = {
    id?: string;
    projectId: string;
    moduleId: string;
    name: string;
    description: string;
    status?: $Enums.ProjectStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EpicUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EpicUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EpicListRelationFilter = {
    every?: Prisma.EpicWhereInput;
    some?: Prisma.EpicWhereInput;
    none?: Prisma.EpicWhereInput;
};
export type EpicOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EpicOrderByRelevanceInput = {
    fields: Prisma.EpicOrderByRelevanceFieldEnum | Prisma.EpicOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type EpicCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EpicAvgOrderByAggregateInput = {
    progress?: Prisma.SortOrder;
};
export type EpicMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EpicMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    moduleId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    progress?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EpicSumOrderByAggregateInput = {
    progress?: Prisma.SortOrder;
};
export type EpicScalarRelationFilter = {
    is?: Prisma.EpicWhereInput;
    isNot?: Prisma.EpicWhereInput;
};
export type EpicCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.EpicCreateWithoutProjectInput, Prisma.EpicUncheckedCreateWithoutProjectInput> | Prisma.EpicCreateWithoutProjectInput[] | Prisma.EpicUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.EpicCreateOrConnectWithoutProjectInput | Prisma.EpicCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.EpicCreateManyProjectInputEnvelope;
    connect?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
};
export type EpicUncheckedCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.EpicCreateWithoutProjectInput, Prisma.EpicUncheckedCreateWithoutProjectInput> | Prisma.EpicCreateWithoutProjectInput[] | Prisma.EpicUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.EpicCreateOrConnectWithoutProjectInput | Prisma.EpicCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.EpicCreateManyProjectInputEnvelope;
    connect?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
};
export type EpicUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.EpicCreateWithoutProjectInput, Prisma.EpicUncheckedCreateWithoutProjectInput> | Prisma.EpicCreateWithoutProjectInput[] | Prisma.EpicUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.EpicCreateOrConnectWithoutProjectInput | Prisma.EpicCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.EpicUpsertWithWhereUniqueWithoutProjectInput | Prisma.EpicUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.EpicCreateManyProjectInputEnvelope;
    set?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    disconnect?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    delete?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    connect?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    update?: Prisma.EpicUpdateWithWhereUniqueWithoutProjectInput | Prisma.EpicUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.EpicUpdateManyWithWhereWithoutProjectInput | Prisma.EpicUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.EpicScalarWhereInput | Prisma.EpicScalarWhereInput[];
};
export type EpicUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.EpicCreateWithoutProjectInput, Prisma.EpicUncheckedCreateWithoutProjectInput> | Prisma.EpicCreateWithoutProjectInput[] | Prisma.EpicUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.EpicCreateOrConnectWithoutProjectInput | Prisma.EpicCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.EpicUpsertWithWhereUniqueWithoutProjectInput | Prisma.EpicUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.EpicCreateManyProjectInputEnvelope;
    set?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    disconnect?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    delete?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    connect?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    update?: Prisma.EpicUpdateWithWhereUniqueWithoutProjectInput | Prisma.EpicUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.EpicUpdateManyWithWhereWithoutProjectInput | Prisma.EpicUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.EpicScalarWhereInput | Prisma.EpicScalarWhereInput[];
};
export type EpicCreateNestedManyWithoutModuleInput = {
    create?: Prisma.XOR<Prisma.EpicCreateWithoutModuleInput, Prisma.EpicUncheckedCreateWithoutModuleInput> | Prisma.EpicCreateWithoutModuleInput[] | Prisma.EpicUncheckedCreateWithoutModuleInput[];
    connectOrCreate?: Prisma.EpicCreateOrConnectWithoutModuleInput | Prisma.EpicCreateOrConnectWithoutModuleInput[];
    createMany?: Prisma.EpicCreateManyModuleInputEnvelope;
    connect?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
};
export type EpicUncheckedCreateNestedManyWithoutModuleInput = {
    create?: Prisma.XOR<Prisma.EpicCreateWithoutModuleInput, Prisma.EpicUncheckedCreateWithoutModuleInput> | Prisma.EpicCreateWithoutModuleInput[] | Prisma.EpicUncheckedCreateWithoutModuleInput[];
    connectOrCreate?: Prisma.EpicCreateOrConnectWithoutModuleInput | Prisma.EpicCreateOrConnectWithoutModuleInput[];
    createMany?: Prisma.EpicCreateManyModuleInputEnvelope;
    connect?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
};
export type EpicUpdateManyWithoutModuleNestedInput = {
    create?: Prisma.XOR<Prisma.EpicCreateWithoutModuleInput, Prisma.EpicUncheckedCreateWithoutModuleInput> | Prisma.EpicCreateWithoutModuleInput[] | Prisma.EpicUncheckedCreateWithoutModuleInput[];
    connectOrCreate?: Prisma.EpicCreateOrConnectWithoutModuleInput | Prisma.EpicCreateOrConnectWithoutModuleInput[];
    upsert?: Prisma.EpicUpsertWithWhereUniqueWithoutModuleInput | Prisma.EpicUpsertWithWhereUniqueWithoutModuleInput[];
    createMany?: Prisma.EpicCreateManyModuleInputEnvelope;
    set?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    disconnect?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    delete?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    connect?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    update?: Prisma.EpicUpdateWithWhereUniqueWithoutModuleInput | Prisma.EpicUpdateWithWhereUniqueWithoutModuleInput[];
    updateMany?: Prisma.EpicUpdateManyWithWhereWithoutModuleInput | Prisma.EpicUpdateManyWithWhereWithoutModuleInput[];
    deleteMany?: Prisma.EpicScalarWhereInput | Prisma.EpicScalarWhereInput[];
};
export type EpicUncheckedUpdateManyWithoutModuleNestedInput = {
    create?: Prisma.XOR<Prisma.EpicCreateWithoutModuleInput, Prisma.EpicUncheckedCreateWithoutModuleInput> | Prisma.EpicCreateWithoutModuleInput[] | Prisma.EpicUncheckedCreateWithoutModuleInput[];
    connectOrCreate?: Prisma.EpicCreateOrConnectWithoutModuleInput | Prisma.EpicCreateOrConnectWithoutModuleInput[];
    upsert?: Prisma.EpicUpsertWithWhereUniqueWithoutModuleInput | Prisma.EpicUpsertWithWhereUniqueWithoutModuleInput[];
    createMany?: Prisma.EpicCreateManyModuleInputEnvelope;
    set?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    disconnect?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    delete?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    connect?: Prisma.EpicWhereUniqueInput | Prisma.EpicWhereUniqueInput[];
    update?: Prisma.EpicUpdateWithWhereUniqueWithoutModuleInput | Prisma.EpicUpdateWithWhereUniqueWithoutModuleInput[];
    updateMany?: Prisma.EpicUpdateManyWithWhereWithoutModuleInput | Prisma.EpicUpdateManyWithWhereWithoutModuleInput[];
    deleteMany?: Prisma.EpicScalarWhereInput | Prisma.EpicScalarWhereInput[];
};
export type EpicCreateNestedOneWithoutTasksInput = {
    create?: Prisma.XOR<Prisma.EpicCreateWithoutTasksInput, Prisma.EpicUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.EpicCreateOrConnectWithoutTasksInput;
    connect?: Prisma.EpicWhereUniqueInput;
};
export type EpicUpdateOneRequiredWithoutTasksNestedInput = {
    create?: Prisma.XOR<Prisma.EpicCreateWithoutTasksInput, Prisma.EpicUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.EpicCreateOrConnectWithoutTasksInput;
    upsert?: Prisma.EpicUpsertWithoutTasksInput;
    connect?: Prisma.EpicWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EpicUpdateToOneWithWhereWithoutTasksInput, Prisma.EpicUpdateWithoutTasksInput>, Prisma.EpicUncheckedUpdateWithoutTasksInput>;
};
export type EpicCreateWithoutProjectInput = {
    id?: string;
    name: string;
    description: string;
    status?: $Enums.ProjectStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    module: Prisma.ModuleCreateNestedOneWithoutEpicsInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutEpicInput;
};
export type EpicUncheckedCreateWithoutProjectInput = {
    id?: string;
    moduleId: string;
    name: string;
    description: string;
    status?: $Enums.ProjectStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutEpicInput;
};
export type EpicCreateOrConnectWithoutProjectInput = {
    where: Prisma.EpicWhereUniqueInput;
    create: Prisma.XOR<Prisma.EpicCreateWithoutProjectInput, Prisma.EpicUncheckedCreateWithoutProjectInput>;
};
export type EpicCreateManyProjectInputEnvelope = {
    data: Prisma.EpicCreateManyProjectInput | Prisma.EpicCreateManyProjectInput[];
    skipDuplicates?: boolean;
};
export type EpicUpsertWithWhereUniqueWithoutProjectInput = {
    where: Prisma.EpicWhereUniqueInput;
    update: Prisma.XOR<Prisma.EpicUpdateWithoutProjectInput, Prisma.EpicUncheckedUpdateWithoutProjectInput>;
    create: Prisma.XOR<Prisma.EpicCreateWithoutProjectInput, Prisma.EpicUncheckedCreateWithoutProjectInput>;
};
export type EpicUpdateWithWhereUniqueWithoutProjectInput = {
    where: Prisma.EpicWhereUniqueInput;
    data: Prisma.XOR<Prisma.EpicUpdateWithoutProjectInput, Prisma.EpicUncheckedUpdateWithoutProjectInput>;
};
export type EpicUpdateManyWithWhereWithoutProjectInput = {
    where: Prisma.EpicScalarWhereInput;
    data: Prisma.XOR<Prisma.EpicUpdateManyMutationInput, Prisma.EpicUncheckedUpdateManyWithoutProjectInput>;
};
export type EpicScalarWhereInput = {
    AND?: Prisma.EpicScalarWhereInput | Prisma.EpicScalarWhereInput[];
    OR?: Prisma.EpicScalarWhereInput[];
    NOT?: Prisma.EpicScalarWhereInput | Prisma.EpicScalarWhereInput[];
    id?: Prisma.StringFilter<"Epic"> | string;
    projectId?: Prisma.StringFilter<"Epic"> | string;
    moduleId?: Prisma.StringFilter<"Epic"> | string;
    name?: Prisma.StringFilter<"Epic"> | string;
    description?: Prisma.StringFilter<"Epic"> | string;
    status?: Prisma.EnumProjectStatusFilter<"Epic"> | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFilter<"Epic"> | Date | string;
    endDate?: Prisma.DateTimeNullableFilter<"Epic"> | Date | string | null;
    progress?: Prisma.IntFilter<"Epic"> | number;
    createdAt?: Prisma.DateTimeFilter<"Epic"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Epic"> | Date | string;
};
export type EpicCreateWithoutModuleInput = {
    id?: string;
    name: string;
    description: string;
    status?: $Enums.ProjectStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    project: Prisma.ProjectCreateNestedOneWithoutEpicsInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutEpicInput;
};
export type EpicUncheckedCreateWithoutModuleInput = {
    id?: string;
    projectId: string;
    name: string;
    description: string;
    status?: $Enums.ProjectStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutEpicInput;
};
export type EpicCreateOrConnectWithoutModuleInput = {
    where: Prisma.EpicWhereUniqueInput;
    create: Prisma.XOR<Prisma.EpicCreateWithoutModuleInput, Prisma.EpicUncheckedCreateWithoutModuleInput>;
};
export type EpicCreateManyModuleInputEnvelope = {
    data: Prisma.EpicCreateManyModuleInput | Prisma.EpicCreateManyModuleInput[];
    skipDuplicates?: boolean;
};
export type EpicUpsertWithWhereUniqueWithoutModuleInput = {
    where: Prisma.EpicWhereUniqueInput;
    update: Prisma.XOR<Prisma.EpicUpdateWithoutModuleInput, Prisma.EpicUncheckedUpdateWithoutModuleInput>;
    create: Prisma.XOR<Prisma.EpicCreateWithoutModuleInput, Prisma.EpicUncheckedCreateWithoutModuleInput>;
};
export type EpicUpdateWithWhereUniqueWithoutModuleInput = {
    where: Prisma.EpicWhereUniqueInput;
    data: Prisma.XOR<Prisma.EpicUpdateWithoutModuleInput, Prisma.EpicUncheckedUpdateWithoutModuleInput>;
};
export type EpicUpdateManyWithWhereWithoutModuleInput = {
    where: Prisma.EpicScalarWhereInput;
    data: Prisma.XOR<Prisma.EpicUpdateManyMutationInput, Prisma.EpicUncheckedUpdateManyWithoutModuleInput>;
};
export type EpicCreateWithoutTasksInput = {
    id?: string;
    name: string;
    description: string;
    status?: $Enums.ProjectStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    project: Prisma.ProjectCreateNestedOneWithoutEpicsInput;
    module: Prisma.ModuleCreateNestedOneWithoutEpicsInput;
};
export type EpicUncheckedCreateWithoutTasksInput = {
    id?: string;
    projectId: string;
    moduleId: string;
    name: string;
    description: string;
    status?: $Enums.ProjectStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EpicCreateOrConnectWithoutTasksInput = {
    where: Prisma.EpicWhereUniqueInput;
    create: Prisma.XOR<Prisma.EpicCreateWithoutTasksInput, Prisma.EpicUncheckedCreateWithoutTasksInput>;
};
export type EpicUpsertWithoutTasksInput = {
    update: Prisma.XOR<Prisma.EpicUpdateWithoutTasksInput, Prisma.EpicUncheckedUpdateWithoutTasksInput>;
    create: Prisma.XOR<Prisma.EpicCreateWithoutTasksInput, Prisma.EpicUncheckedCreateWithoutTasksInput>;
    where?: Prisma.EpicWhereInput;
};
export type EpicUpdateToOneWithWhereWithoutTasksInput = {
    where?: Prisma.EpicWhereInput;
    data: Prisma.XOR<Prisma.EpicUpdateWithoutTasksInput, Prisma.EpicUncheckedUpdateWithoutTasksInput>;
};
export type EpicUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    project?: Prisma.ProjectUpdateOneRequiredWithoutEpicsNestedInput;
    module?: Prisma.ModuleUpdateOneRequiredWithoutEpicsNestedInput;
};
export type EpicUncheckedUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EpicCreateManyProjectInput = {
    id?: string;
    moduleId: string;
    name: string;
    description: string;
    status?: $Enums.ProjectStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EpicUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    module?: Prisma.ModuleUpdateOneRequiredWithoutEpicsNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutEpicNestedInput;
};
export type EpicUncheckedUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutEpicNestedInput;
};
export type EpicUncheckedUpdateManyWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    moduleId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EpicCreateManyModuleInput = {
    id?: string;
    projectId: string;
    name: string;
    description: string;
    status?: $Enums.ProjectStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    progress?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EpicUpdateWithoutModuleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    project?: Prisma.ProjectUpdateOneRequiredWithoutEpicsNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutEpicNestedInput;
};
export type EpicUncheckedUpdateWithoutModuleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutEpicNestedInput;
};
export type EpicUncheckedUpdateManyWithoutModuleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    progress?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EpicCountOutputType = {
    tasks: number;
};
export type EpicCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tasks?: boolean | EpicCountOutputTypeCountTasksArgs;
};
export type EpicCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EpicCountOutputTypeSelect<ExtArgs> | null;
};
export type EpicCountOutputTypeCountTasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskWhereInput;
};
export type EpicSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    moduleId?: boolean;
    name?: boolean;
    description?: boolean;
    status?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    progress?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>;
    tasks?: boolean | Prisma.Epic$tasksArgs<ExtArgs>;
    _count?: boolean | Prisma.EpicCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["epic"]>;
export type EpicSelectScalar = {
    id?: boolean;
    projectId?: boolean;
    moduleId?: boolean;
    name?: boolean;
    description?: boolean;
    status?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    progress?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type EpicOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "projectId" | "moduleId" | "name" | "description" | "status" | "startDate" | "endDate" | "progress" | "createdAt" | "updatedAt", ExtArgs["result"]["epic"]>;
export type EpicInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>;
    tasks?: boolean | Prisma.Epic$tasksArgs<ExtArgs>;
    _count?: boolean | Prisma.EpicCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $EpicPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Epic";
    objects: {
        project: Prisma.$ProjectPayload<ExtArgs>;
        module: Prisma.$ModulePayload<ExtArgs>;
        tasks: Prisma.$TaskPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        projectId: string;
        moduleId: string;
        name: string;
        description: string;
        status: $Enums.ProjectStatus;
        startDate: Date;
        endDate: Date | null;
        progress: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["epic"]>;
    composites: {};
};
export type EpicGetPayload<S extends boolean | null | undefined | EpicDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EpicPayload, S>;
export type EpicCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EpicFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EpicCountAggregateInputType | true;
};
export interface EpicDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Epic'];
        meta: {
            name: 'Epic';
        };
    };
    findUnique<T extends EpicFindUniqueArgs>(args: Prisma.SelectSubset<T, EpicFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EpicClient<runtime.Types.Result.GetResult<Prisma.$EpicPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EpicFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EpicFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EpicClient<runtime.Types.Result.GetResult<Prisma.$EpicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EpicFindFirstArgs>(args?: Prisma.SelectSubset<T, EpicFindFirstArgs<ExtArgs>>): Prisma.Prisma__EpicClient<runtime.Types.Result.GetResult<Prisma.$EpicPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EpicFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EpicFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EpicClient<runtime.Types.Result.GetResult<Prisma.$EpicPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EpicFindManyArgs>(args?: Prisma.SelectSubset<T, EpicFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EpicPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EpicCreateArgs>(args: Prisma.SelectSubset<T, EpicCreateArgs<ExtArgs>>): Prisma.Prisma__EpicClient<runtime.Types.Result.GetResult<Prisma.$EpicPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EpicCreateManyArgs>(args?: Prisma.SelectSubset<T, EpicCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends EpicDeleteArgs>(args: Prisma.SelectSubset<T, EpicDeleteArgs<ExtArgs>>): Prisma.Prisma__EpicClient<runtime.Types.Result.GetResult<Prisma.$EpicPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EpicUpdateArgs>(args: Prisma.SelectSubset<T, EpicUpdateArgs<ExtArgs>>): Prisma.Prisma__EpicClient<runtime.Types.Result.GetResult<Prisma.$EpicPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EpicDeleteManyArgs>(args?: Prisma.SelectSubset<T, EpicDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EpicUpdateManyArgs>(args: Prisma.SelectSubset<T, EpicUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends EpicUpsertArgs>(args: Prisma.SelectSubset<T, EpicUpsertArgs<ExtArgs>>): Prisma.Prisma__EpicClient<runtime.Types.Result.GetResult<Prisma.$EpicPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EpicCountArgs>(args?: Prisma.Subset<T, EpicCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EpicCountAggregateOutputType> : number>;
    aggregate<T extends EpicAggregateArgs>(args: Prisma.Subset<T, EpicAggregateArgs>): Prisma.PrismaPromise<GetEpicAggregateType<T>>;
    groupBy<T extends EpicGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EpicGroupByArgs['orderBy'];
    } : {
        orderBy?: EpicGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EpicGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEpicGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EpicFieldRefs;
}
export interface Prisma__EpicClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    project<T extends Prisma.ProjectDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProjectDefaultArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    module<T extends Prisma.ModuleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ModuleDefaultArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    tasks<T extends Prisma.Epic$tasksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Epic$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EpicFieldRefs {
    readonly id: Prisma.FieldRef<"Epic", 'String'>;
    readonly projectId: Prisma.FieldRef<"Epic", 'String'>;
    readonly moduleId: Prisma.FieldRef<"Epic", 'String'>;
    readonly name: Prisma.FieldRef<"Epic", 'String'>;
    readonly description: Prisma.FieldRef<"Epic", 'String'>;
    readonly status: Prisma.FieldRef<"Epic", 'ProjectStatus'>;
    readonly startDate: Prisma.FieldRef<"Epic", 'DateTime'>;
    readonly endDate: Prisma.FieldRef<"Epic", 'DateTime'>;
    readonly progress: Prisma.FieldRef<"Epic", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Epic", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Epic", 'DateTime'>;
}
export type EpicFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EpicSelect<ExtArgs> | null;
    omit?: Prisma.EpicOmit<ExtArgs> | null;
    include?: Prisma.EpicInclude<ExtArgs> | null;
    where: Prisma.EpicWhereUniqueInput;
};
export type EpicFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EpicSelect<ExtArgs> | null;
    omit?: Prisma.EpicOmit<ExtArgs> | null;
    include?: Prisma.EpicInclude<ExtArgs> | null;
    where: Prisma.EpicWhereUniqueInput;
};
export type EpicFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EpicFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EpicFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EpicCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EpicSelect<ExtArgs> | null;
    omit?: Prisma.EpicOmit<ExtArgs> | null;
    include?: Prisma.EpicInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EpicCreateInput, Prisma.EpicUncheckedCreateInput>;
};
export type EpicCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EpicCreateManyInput | Prisma.EpicCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EpicUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EpicSelect<ExtArgs> | null;
    omit?: Prisma.EpicOmit<ExtArgs> | null;
    include?: Prisma.EpicInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EpicUpdateInput, Prisma.EpicUncheckedUpdateInput>;
    where: Prisma.EpicWhereUniqueInput;
};
export type EpicUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EpicUpdateManyMutationInput, Prisma.EpicUncheckedUpdateManyInput>;
    where?: Prisma.EpicWhereInput;
    limit?: number;
};
export type EpicUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EpicSelect<ExtArgs> | null;
    omit?: Prisma.EpicOmit<ExtArgs> | null;
    include?: Prisma.EpicInclude<ExtArgs> | null;
    where: Prisma.EpicWhereUniqueInput;
    create: Prisma.XOR<Prisma.EpicCreateInput, Prisma.EpicUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EpicUpdateInput, Prisma.EpicUncheckedUpdateInput>;
};
export type EpicDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EpicSelect<ExtArgs> | null;
    omit?: Prisma.EpicOmit<ExtArgs> | null;
    include?: Prisma.EpicInclude<ExtArgs> | null;
    where: Prisma.EpicWhereUniqueInput;
};
export type EpicDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EpicWhereInput;
    limit?: number;
};
export type Epic$tasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EpicDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EpicSelect<ExtArgs> | null;
    omit?: Prisma.EpicOmit<ExtArgs> | null;
    include?: Prisma.EpicInclude<ExtArgs> | null;
};
