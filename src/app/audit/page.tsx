"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoading } from "@/components/shared/page-loading";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { History, ShieldAlert } from "lucide-react";
import { AuditEntry, AuditRow, fetchAuditLogs, ENTITY_LABEL } from "@/features/audit/audit-ui";

const FILTERS: { key: string; label: string }[] = [
  { key: "ALL", label: "Tudo" },
  { key: "TASK", label: "Tarefas" },
  { key: "PROJECT", label: "Projetos" },
  { key: "MODULE", label: "Módulos" },
  { key: "EPIC", label: "Épicos" },
  { key: "USER", label: "Usuários" },
];

export default function AuditPage() {
  const { isAdmin } = useAuth();
  const [entries, setEntries] = useState<AuditEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    fetchAuditLogs({ limit: 300 })
      .then(setEntries)
      .catch((e) => setError(e instanceof Error ? e.message : "Não foi possível carregar a auditoria."))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const visible = useMemo(
    () => (entries ?? []).filter((e) => filter === "ALL" || e.entityType === filter),
    [entries, filter],
  );

  if (!isAdmin) {
    return (
      <div className="p-6">
        <EmptyState icon={ShieldAlert} title="Acesso restrito" description="A auditoria é visível apenas para administradores." />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Auditoria"
        description="Registro de quem fez o quê e quando — criações, edições, mudanças de status, atribuições, comentários e exclusões."
      />
      <div className="p-6 w-full">
        {/* Filtros por entidade */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                filter === f.key
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <PageLoading label="Carregando auditoria..." />
        ) : error ? (
          <p className="text-sm text-red-400 py-4">{error}</p>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={History}
            title="Nenhum registro"
            description={filter === "ALL" ? "As ações realizadas no sistema aparecerão aqui." : `Nenhuma ação de ${ENTITY_LABEL[filter] ?? filter} registrada.`}
          />
        ) : (
          <ol className="space-y-2 max-w-3xl">
            {visible.map((e) => (
              <AuditRow key={e.id} entry={e} showEntity />
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
