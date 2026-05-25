import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ProjectDeveloperModel = runtime.Types.Result.DefaultSelection<Prisma.$ProjectDeveloperPayload>;
export type AggregateProjectDeveloper = {
    _count: ProjectDeveloperCountAggregateOutputType | null;
    _min: ProjectDeveloperMinAggregateOutputType | null;
    _max: ProjectDeveloperMaxAggregateOutputType | null;
};
export type ProjectDeveloperMinAggregateOutputType = {
    projectId: string | null;
    userId: string | null;
};
export type ProjectDeveloperMaxAggregateOutputType = {
    projectId: string | null;
    userId: string | null;
};
export type ProjectDeveloperCountAggregateOutputType = {
    projectId: number;
    userId: number;
    _all: number;
};
export type ProjectDeveloperMinAggregateInputType = {
    projectId?: true;
    userId?: true;
};
export type ProjectDeveloperMaxAggregateInputType = {
    projectId?: true;
    userId?: true;
};
export type ProjectDeveloperCountAggregateInputType = {
    projectId?: true;
    userId?: true;
    _all?: true;
};
export type ProjectDeveloperAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectDeveloperWhereInput;
    orderBy?: Prisma.ProjectDeveloperOrderByWithRelationInput | Prisma.ProjectDeveloperOrderByWithRelationInput[];
    cursor?: Prisma.ProjectDeveloperWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProjectDeveloperCountAggregateInputType;
    _min?: ProjectDeveloperMinAggregateInputType;
    _max?: ProjectDeveloperMaxAggregateInputType;
};
export type GetProjectDeveloperAggregateType<T extends ProjectDeveloperAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectDeveloper]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProjectDeveloper[P]> : Prisma.GetScalarType<T[P], AggregateProjectDeveloper[P]>;
};
export type ProjectDeveloperGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectDeveloperWhereInput;
    orderBy?: Prisma.ProjectDeveloperOrderByWithAggregationInput | Prisma.ProjectDeveloperOrderByWithAggregationInput[];
    by: Prisma.ProjectDeveloperScalarFieldEnum[] | Prisma.ProjectDeveloperScalarFieldEnum;
    having?: Prisma.ProjectDeveloperScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProjectDeveloperCountAggregateInputType | true;
    _min?: ProjectDeveloperMinAggregateInputType;
    _max?: ProjectDeveloperMaxAggregateInputType;
};
export type ProjectDeveloperGroupByOutputType = {
    projectId: string;
    userId: string;
    _count: ProjectDeveloperCountAggregateOutputType | null;
    _min: ProjectDeveloperMinAggregateOutputType | null;
    _max: ProjectDeveloperMaxAggregateOutputType | null;
};
export type GetProjectDeveloperGroupByPayload<T extends ProjectDeveloperGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProjectDeveloperGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProjectDeveloperGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProjectDeveloperGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProjectDeveloperGroupByOutputType[P]>;
}>>;
export type ProjectDeveloperWhereInput = {
    AND?: Prisma.ProjectDeveloperWhereInput | Prisma.ProjectDeveloperWhereInput[];
    OR?: Prisma.ProjectDeveloperWhereInput[];
    NOT?: Prisma.ProjectDeveloperWhereInput | Prisma.ProjectDeveloperWhereInput[];
    projectId?: Prisma.StringFilter<"ProjectDeveloper"> | string;
    userId?: Prisma.StringFilter<"ProjectDeveloper"> | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type ProjectDeveloperOrderByWithRelationInput = {
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    project?: Prisma.ProjectOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    _relevance?: Prisma.ProjectDeveloperOrderByRelevanceInput;
};
export type ProjectDeveloperWhereUniqueInput = Prisma.AtLeast<{
    projectId_userId?: Prisma.ProjectDeveloperProjectIdUserIdCompoundUniqueInput;
    AND?: Prisma.ProjectDeveloperWhereInput | Prisma.ProjectDeveloperWhereInput[];
    OR?: Prisma.ProjectDeveloperWhereInput[];
    NOT?: Prisma.ProjectDeveloperWhereInput | Prisma.ProjectDeveloperWhereInput[];
    projectId?: Prisma.StringFilter<"ProjectDeveloper"> | string;
    userId?: Prisma.StringFilter<"ProjectDeveloper"> | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "projectId_userId">;
export type ProjectDeveloperOrderByWithAggregationInput = {
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    _count?: Prisma.ProjectDeveloperCountOrderByAggregateInput;
    _max?: Prisma.ProjectDeveloperMaxOrderByAggregateInput;
    _min?: Prisma.ProjectDeveloperMinOrderByAggregateInput;
};
export type ProjectDeveloperScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProjectDeveloperScalarWhereWithAggregatesInput | Prisma.ProjectDeveloperScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProjectDeveloperScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProjectDeveloperScalarWhereWithAggregatesInput | Prisma.ProjectDeveloperScalarWhereWithAggregatesInput[];
    projectId?: Prisma.StringWithAggregatesFilter<"ProjectDeveloper"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"ProjectDeveloper"> | string;
};
export type ProjectDeveloperCreateInput = {
    project: Prisma.ProjectCreateNestedOneWithoutDevelopersInput;
    user: Prisma.UserCreateNestedOneWithoutProjectsInput;
};
export type ProjectDeveloperUncheckedCreateInput = {
    projectId: string;
    userId: string;
};
export type ProjectDeveloperUpdateInput = {
    project?: Prisma.ProjectUpdateOneRequiredWithoutDevelopersNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutProjectsNestedInput;
};
export type ProjectDeveloperUncheckedUpdateInput = {
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ProjectDeveloperCreateManyInput = {
    projectId: string;
    userId: string;
};
export type ProjectDeveloperUpdateManyMutationInput = {};
export type ProjectDeveloperUncheckedUpdateManyInput = {
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ProjectDeveloperListRelationFilter = {
    every?: Prisma.ProjectDeveloperWhereInput;
    some?: Prisma.ProjectDeveloperWhereInput;
    none?: Prisma.ProjectDeveloperWhereInput;
};
export type ProjectDeveloperOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ProjectDeveloperOrderByRelevanceInput = {
    fields: Prisma.ProjectDeveloperOrderByRelevanceFieldEnum | Prisma.ProjectDeveloperOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type ProjectDeveloperProjectIdUserIdCompoundUniqueInput = {
    projectId: string;
    userId: string;
};
export type ProjectDeveloperCountOrderByAggregateInput = {
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type ProjectDeveloperMaxOrderByAggregateInput = {
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type ProjectDeveloperMinOrderByAggregateInput = {
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type ProjectDeveloperCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ProjectDeveloperCreateWithoutUserInput, Prisma.ProjectDeveloperUncheckedCreateWithoutUserInput> | Prisma.ProjectDeveloperCreateWithoutUserInput[] | Prisma.ProjectDeveloperUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectDeveloperCreateOrConnectWithoutUserInput | Prisma.ProjectDeveloperCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ProjectDeveloperCreateManyUserInputEnvelope;
    connect?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
};
export type ProjectDeveloperUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ProjectDeveloperCreateWithoutUserInput, Prisma.ProjectDeveloperUncheckedCreateWithoutUserInput> | Prisma.ProjectDeveloperCreateWithoutUserInput[] | Prisma.ProjectDeveloperUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectDeveloperCreateOrConnectWithoutUserInput | Prisma.ProjectDeveloperCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ProjectDeveloperCreateManyUserInputEnvelope;
    connect?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
};
export type ProjectDeveloperUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectDeveloperCreateWithoutUserInput, Prisma.ProjectDeveloperUncheckedCreateWithoutUserInput> | Prisma.ProjectDeveloperCreateWithoutUserInput[] | Prisma.ProjectDeveloperUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectDeveloperCreateOrConnectWithoutUserInput | Prisma.ProjectDeveloperCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ProjectDeveloperUpsertWithWhereUniqueWithoutUserInput | Prisma.ProjectDeveloperUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ProjectDeveloperCreateManyUserInputEnvelope;
    set?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    disconnect?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    delete?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    connect?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    update?: Prisma.ProjectDeveloperUpdateWithWhereUniqueWithoutUserInput | Prisma.ProjectDeveloperUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ProjectDeveloperUpdateManyWithWhereWithoutUserInput | Prisma.ProjectDeveloperUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ProjectDeveloperScalarWhereInput | Prisma.ProjectDeveloperScalarWhereInput[];
};
export type ProjectDeveloperUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectDeveloperCreateWithoutUserInput, Prisma.ProjectDeveloperUncheckedCreateWithoutUserInput> | Prisma.ProjectDeveloperCreateWithoutUserInput[] | Prisma.ProjectDeveloperUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectDeveloperCreateOrConnectWithoutUserInput | Prisma.ProjectDeveloperCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ProjectDeveloperUpsertWithWhereUniqueWithoutUserInput | Prisma.ProjectDeveloperUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ProjectDeveloperCreateManyUserInputEnvelope;
    set?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    disconnect?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    delete?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    connect?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    update?: Prisma.ProjectDeveloperUpdateWithWhereUniqueWithoutUserInput | Prisma.ProjectDeveloperUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ProjectDeveloperUpdateManyWithWhereWithoutUserInput | Prisma.ProjectDeveloperUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ProjectDeveloperScalarWhereInput | Prisma.ProjectDeveloperScalarWhereInput[];
};
export type ProjectDeveloperCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectDeveloperCreateWithoutProjectInput, Prisma.ProjectDeveloperUncheckedCreateWithoutProjectInput> | Prisma.ProjectDeveloperCreateWithoutProjectInput[] | Prisma.ProjectDeveloperUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectDeveloperCreateOrConnectWithoutProjectInput | Prisma.ProjectDeveloperCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectDeveloperCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
};
export type ProjectDeveloperUncheckedCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectDeveloperCreateWithoutProjectInput, Prisma.ProjectDeveloperUncheckedCreateWithoutProjectInput> | Prisma.ProjectDeveloperCreateWithoutProjectInput[] | Prisma.ProjectDeveloperUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectDeveloperCreateOrConnectWithoutProjectInput | Prisma.ProjectDeveloperCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectDeveloperCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
};
export type ProjectDeveloperUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectDeveloperCreateWithoutProjectInput, Prisma.ProjectDeveloperUncheckedCreateWithoutProjectInput> | Prisma.ProjectDeveloperCreateWithoutProjectInput[] | Prisma.ProjectDeveloperUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectDeveloperCreateOrConnectWithoutProjectInput | Prisma.ProjectDeveloperCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectDeveloperUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectDeveloperUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectDeveloperCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    disconnect?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    delete?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    connect?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    update?: Prisma.ProjectDeveloperUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectDeveloperUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectDeveloperUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectDeveloperUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectDeveloperScalarWhereInput | Prisma.ProjectDeveloperScalarWhereInput[];
};
export type ProjectDeveloperUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectDeveloperCreateWithoutProjectInput, Prisma.ProjectDeveloperUncheckedCreateWithoutProjectInput> | Prisma.ProjectDeveloperCreateWithoutProjectInput[] | Prisma.ProjectDeveloperUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectDeveloperCreateOrConnectWithoutProjectInput | Prisma.ProjectDeveloperCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectDeveloperUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectDeveloperUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectDeveloperCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    disconnect?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    delete?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    connect?: Prisma.ProjectDeveloperWhereUniqueInput | Prisma.ProjectDeveloperWhereUniqueInput[];
    update?: Prisma.ProjectDeveloperUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectDeveloperUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectDeveloperUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectDeveloperUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectDeveloperScalarWhereInput | Prisma.ProjectDeveloperScalarWhereInput[];
};
export type ProjectDeveloperCreateWithoutUserInput = {
    project: Prisma.ProjectCreateNestedOneWithoutDevelopersInput;
};
export type ProjectDeveloperUncheckedCreateWithoutUserInput = {
    projectId: string;
};
export type ProjectDeveloperCreateOrConnectWithoutUserInput = {
    where: Prisma.ProjectDeveloperWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectDeveloperCreateWithoutUserInput, Prisma.ProjectDeveloperUncheckedCreateWithoutUserInput>;
};
export type ProjectDeveloperCreateManyUserInputEnvelope = {
    data: Prisma.ProjectDeveloperCreateManyUserInput | Prisma.ProjectDeveloperCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ProjectDeveloperUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ProjectDeveloperWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectDeveloperUpdateWithoutUserInput, Prisma.ProjectDeveloperUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ProjectDeveloperCreateWithoutUserInput, Prisma.ProjectDeveloperUncheckedCreateWithoutUserInput>;
};
export type ProjectDeveloperUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ProjectDeveloperWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectDeveloperUpdateWithoutUserInput, Prisma.ProjectDeveloperUncheckedUpdateWithoutUserInput>;
};
export type ProjectDeveloperUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ProjectDeveloperScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectDeveloperUpdateManyMutationInput, Prisma.ProjectDeveloperUncheckedUpdateManyWithoutUserInput>;
};
export type ProjectDeveloperScalarWhereInput = {
    AND?: Prisma.ProjectDeveloperScalarWhereInput | Prisma.ProjectDeveloperScalarWhereInput[];
    OR?: Prisma.ProjectDeveloperScalarWhereInput[];
    NOT?: Prisma.ProjectDeveloperScalarWhereInput | Prisma.ProjectDeveloperScalarWhereInput[];
    projectId?: Prisma.StringFilter<"ProjectDeveloper"> | string;
    userId?: Prisma.StringFilter<"ProjectDeveloper"> | string;
};
export type ProjectDeveloperCreateWithoutProjectInput = {
    user: Prisma.UserCreateNestedOneWithoutProjectsInput;
};
export type ProjectDeveloperUncheckedCreateWithoutProjectInput = {
    userId: string;
};
export type ProjectDeveloperCreateOrConnectWithoutProjectInput = {
    where: Prisma.ProjectDeveloperWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectDeveloperCreateWithoutProjectInput, Prisma.ProjectDeveloperUncheckedCreateWithoutProjectInput>;
};
export type ProjectDeveloperCreateManyProjectInputEnvelope = {
    data: Prisma.ProjectDeveloperCreateManyProjectInput | Prisma.ProjectDeveloperCreateManyProjectInput[];
    skipDuplicates?: boolean;
};
export type ProjectDeveloperUpsertWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectDeveloperWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectDeveloperUpdateWithoutProjectInput, Prisma.ProjectDeveloperUncheckedUpdateWithoutProjectInput>;
    create: Prisma.XOR<Prisma.ProjectDeveloperCreateWithoutProjectInput, Prisma.ProjectDeveloperUncheckedCreateWithoutProjectInput>;
};
export type ProjectDeveloperUpdateWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectDeveloperWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectDeveloperUpdateWithoutProjectInput, Prisma.ProjectDeveloperUncheckedUpdateWithoutProjectInput>;
};
export type ProjectDeveloperUpdateManyWithWhereWithoutProjectInput = {
    where: Prisma.ProjectDeveloperScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectDeveloperUpdateManyMutationInput, Prisma.ProjectDeveloperUncheckedUpdateManyWithoutProjectInput>;
};
export type ProjectDeveloperCreateManyUserInput = {
    projectId: string;
};
export type ProjectDeveloperUpdateWithoutUserInput = {
    project?: Prisma.ProjectUpdateOneRequiredWithoutDevelopersNestedInput;
};
export type ProjectDeveloperUncheckedUpdateWithoutUserInput = {
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ProjectDeveloperUncheckedUpdateManyWithoutUserInput = {
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ProjectDeveloperCreateManyProjectInput = {
    userId: string;
};
export type ProjectDeveloperUpdateWithoutProjectInput = {
    user?: Prisma.UserUpdateOneRequiredWithoutProjectsNestedInput;
};
export type ProjectDeveloperUncheckedUpdateWithoutProjectInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ProjectDeveloperUncheckedUpdateManyWithoutProjectInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ProjectDeveloperSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    projectId?: boolean;
    userId?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectDeveloper"]>;
export type ProjectDeveloperSelectScalar = {
    projectId?: boolean;
    userId?: boolean;
};
export type ProjectDeveloperOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"projectId" | "userId", ExtArgs["result"]["projectDeveloper"]>;
export type ProjectDeveloperInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ProjectDeveloperPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProjectDeveloper";
    objects: {
        project: Prisma.$ProjectPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        projectId: string;
        userId: string;
    }, ExtArgs["result"]["projectDeveloper"]>;
    composites: {};
};
export type ProjectDeveloperGetPayload<S extends boolean | null | undefined | ProjectDeveloperDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProjectDeveloperPayload, S>;
export type ProjectDeveloperCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProjectDeveloperFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProjectDeveloperCountAggregateInputType | true;
};
export interface ProjectDeveloperDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProjectDeveloper'];
        meta: {
            name: 'ProjectDeveloper';
        };
    };
    findUnique<T extends ProjectDeveloperFindUniqueArgs>(args: Prisma.SelectSubset<T, ProjectDeveloperFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProjectDeveloperClient<runtime.Types.Result.GetResult<Prisma.$ProjectDeveloperPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProjectDeveloperFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProjectDeveloperFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectDeveloperClient<runtime.Types.Result.GetResult<Prisma.$ProjectDeveloperPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProjectDeveloperFindFirstArgs>(args?: Prisma.SelectSubset<T, ProjectDeveloperFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProjectDeveloperClient<runtime.Types.Result.GetResult<Prisma.$ProjectDeveloperPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProjectDeveloperFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProjectDeveloperFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectDeveloperClient<runtime.Types.Result.GetResult<Prisma.$ProjectDeveloperPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProjectDeveloperFindManyArgs>(args?: Prisma.SelectSubset<T, ProjectDeveloperFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectDeveloperPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProjectDeveloperCreateArgs>(args: Prisma.SelectSubset<T, ProjectDeveloperCreateArgs<ExtArgs>>): Prisma.Prisma__ProjectDeveloperClient<runtime.Types.Result.GetResult<Prisma.$ProjectDeveloperPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProjectDeveloperCreateManyArgs>(args?: Prisma.SelectSubset<T, ProjectDeveloperCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    delete<T extends ProjectDeveloperDeleteArgs>(args: Prisma.SelectSubset<T, ProjectDeveloperDeleteArgs<ExtArgs>>): Prisma.Prisma__ProjectDeveloperClient<runtime.Types.Result.GetResult<Prisma.$ProjectDeveloperPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProjectDeveloperUpdateArgs>(args: Prisma.SelectSubset<T, ProjectDeveloperUpdateArgs<ExtArgs>>): Prisma.Prisma__ProjectDeveloperClient<runtime.Types.Result.GetResult<Prisma.$ProjectDeveloperPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProjectDeveloperDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProjectDeveloperDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProjectDeveloperUpdateManyArgs>(args: Prisma.SelectSubset<T, ProjectDeveloperUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    upsert<T extends ProjectDeveloperUpsertArgs>(args: Prisma.SelectSubset<T, ProjectDeveloperUpsertArgs<ExtArgs>>): Prisma.Prisma__ProjectDeveloperClient<runtime.Types.Result.GetResult<Prisma.$ProjectDeveloperPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProjectDeveloperCountArgs>(args?: Prisma.Subset<T, ProjectDeveloperCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProjectDeveloperCountAggregateOutputType> : number>;
    aggregate<T extends ProjectDeveloperAggregateArgs>(args: Prisma.Subset<T, ProjectDeveloperAggregateArgs>): Prisma.PrismaPromise<GetProjectDeveloperAggregateType<T>>;
    groupBy<T extends ProjectDeveloperGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProjectDeveloperGroupByArgs['orderBy'];
    } : {
        orderBy?: ProjectDeveloperGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProjectDeveloperGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectDeveloperGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProjectDeveloperFieldRefs;
}
export interface Prisma__ProjectDeveloperClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    project<T extends Prisma.ProjectDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProjectDefaultArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProjectDeveloperFieldRefs {
    readonly projectId: Prisma.FieldRef<"ProjectDeveloper", 'String'>;
    readonly userId: Prisma.FieldRef<"ProjectDeveloper", 'String'>;
}
export type ProjectDeveloperFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectDeveloperSelect<ExtArgs> | null;
    omit?: Prisma.ProjectDeveloperOmit<ExtArgs> | null;
    include?: Prisma.ProjectDeveloperInclude<ExtArgs> | null;
    where: Prisma.ProjectDeveloperWhereUniqueInput;
};
export type ProjectDeveloperFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectDeveloperSelect<ExtArgs> | null;
    omit?: Prisma.ProjectDeveloperOmit<ExtArgs> | null;
    include?: Prisma.ProjectDeveloperInclude<ExtArgs> | null;
    where: Prisma.ProjectDeveloperWhereUniqueInput;
};
export type ProjectDeveloperFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectDeveloperSelect<ExtArgs> | null;
    omit?: Prisma.ProjectDeveloperOmit<ExtArgs> | null;
    include?: Prisma.ProjectDeveloperInclude<ExtArgs> | null;
    where?: Prisma.ProjectDeveloperWhereInput;
    orderBy?: Prisma.ProjectDeveloperOrderByWithRelationInput | Prisma.ProjectDeveloperOrderByWithRelationInput[];
    cursor?: Prisma.ProjectDeveloperWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectDeveloperScalarFieldEnum | Prisma.ProjectDeveloperScalarFieldEnum[];
};
export type ProjectDeveloperFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectDeveloperSelect<ExtArgs> | null;
    omit?: Prisma.ProjectDeveloperOmit<ExtArgs> | null;
    include?: Prisma.ProjectDeveloperInclude<ExtArgs> | null;
    where?: Prisma.ProjectDeveloperWhereInput;
    orderBy?: Prisma.ProjectDeveloperOrderByWithRelationInput | Prisma.ProjectDeveloperOrderByWithRelationInput[];
    cursor?: Prisma.ProjectDeveloperWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectDeveloperScalarFieldEnum | Prisma.ProjectDeveloperScalarFieldEnum[];
};
export type ProjectDeveloperFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectDeveloperSelect<ExtArgs> | null;
    omit?: Prisma.ProjectDeveloperOmit<ExtArgs> | null;
    include?: Prisma.ProjectDeveloperInclude<ExtArgs> | null;
    where?: Prisma.ProjectDeveloperWhereInput;
    orderBy?: Prisma.ProjectDeveloperOrderByWithRelationInput | Prisma.ProjectDeveloperOrderByWithRelationInput[];
    cursor?: Prisma.ProjectDeveloperWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectDeveloperScalarFieldEnum | Prisma.ProjectDeveloperScalarFieldEnum[];
};
export type ProjectDeveloperCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectDeveloperSelect<ExtArgs> | null;
    omit?: Prisma.ProjectDeveloperOmit<ExtArgs> | null;
    include?: Prisma.ProjectDeveloperInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectDeveloperCreateInput, Prisma.ProjectDeveloperUncheckedCreateInput>;
};
export type ProjectDeveloperCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProjectDeveloperCreateManyInput | Prisma.ProjectDeveloperCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProjectDeveloperUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectDeveloperSelect<ExtArgs> | null;
    omit?: Prisma.ProjectDeveloperOmit<ExtArgs> | null;
    include?: Prisma.ProjectDeveloperInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectDeveloperUpdateInput, Prisma.ProjectDeveloperUncheckedUpdateInput>;
    where: Prisma.ProjectDeveloperWhereUniqueInput;
};
export type ProjectDeveloperUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProjectDeveloperUpdateManyMutationInput, Prisma.ProjectDeveloperUncheckedUpdateManyInput>;
    where?: Prisma.ProjectDeveloperWhereInput;
    limit?: number;
};
export type ProjectDeveloperUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectDeveloperSelect<ExtArgs> | null;
    omit?: Prisma.ProjectDeveloperOmit<ExtArgs> | null;
    include?: Prisma.ProjectDeveloperInclude<ExtArgs> | null;
    where: Prisma.ProjectDeveloperWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectDeveloperCreateInput, Prisma.ProjectDeveloperUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProjectDeveloperUpdateInput, Prisma.ProjectDeveloperUncheckedUpdateInput>;
};
export type ProjectDeveloperDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectDeveloperSelect<ExtArgs> | null;
    omit?: Prisma.ProjectDeveloperOmit<ExtArgs> | null;
    include?: Prisma.ProjectDeveloperInclude<ExtArgs> | null;
    where: Prisma.ProjectDeveloperWhereUniqueInput;
};
export type ProjectDeveloperDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectDeveloperWhereInput;
    limit?: number;
};
export type ProjectDeveloperDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectDeveloperSelect<ExtArgs> | null;
    omit?: Prisma.ProjectDeveloperOmit<ExtArgs> | null;
    include?: Prisma.ProjectDeveloperInclude<ExtArgs> | null;
};
