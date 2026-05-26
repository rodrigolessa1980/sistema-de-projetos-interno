export declare enum UserRole {
    ADMIN = "ADMIN",
    DEVELOPER = "DEVELOPER"
}
export declare enum ProjectStatus {
    ATIVO = "ATIVO",
    PAUSADO = "PAUSADO",
    CONCLUIDO = "CONCLUIDO",
    CANCELADO = "CANCELADO",
    NA_FILA = "NA_FILA"
}
export declare enum TaskStatus {
    BACKLOG = "BACKLOG",
    PLANEJADA = "PLANEJADA",
    BLOQUEADA = "BLOQUEADA",
    EM_DESENVOLVIMENTO = "EM_DESENVOLVIMENTO",
    EM_REVISAO = "EM_REVISAO",
    HOMOLOGACAO = "HOMOLOGACAO",
    CONCLUIDA = "CONCLUIDA",
    CANCELADA = "CANCELADA"
}
export declare enum DependencyType {
    BLOCKS = "BLOCKS",
    BLOCKED_BY = "BLOCKED_BY",
    RELATED = "RELATED"
}
export declare enum TimeLogSource {
    TIMER = "TIMER",
    MANUAL = "MANUAL"
}
