"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { History } from "lucide-react";
import { AuditEntry, AuditRow, fetchAuditLogs } from "@/features/audit/audit-ui";

interface Props {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskAuditDialog({ taskId, open, onOpenChange }: Props) {
  const [entries, setEntries] = useState<AuditEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    fetchAuditLogs({ entityId: taskId, limit: 100 })
      .then(setEntries)
      .catch((e) => setError(e instanceof Error ? e.message : "Não foi possível carregar o histórico."))
      .finally(() => setLoading(false));
  }, [open, taskId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700/50 max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 flex items-center gap-2">
            <History className="w-4 h-4 text-violet-400" /> Histórico da tarefa
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && <p className="text-sm text-red-400 py-4">{error}</p>}

        {!loading && !error && entries && entries.length === 0 && (
          <p className="text-sm text-zinc-500 py-6 text-center">
            Nenhum registro ainda. Ações futuras (edições, comentários, status) aparecerão aqui.
          </p>
        )}

        {!loading && !error && entries && entries.length > 0 && (
          <ol className="space-y-2">
            {entries.map((e) => (
              <AuditRow key={e.id} entry={e} />
            ))}
          </ol>
        )}
      </DialogContent>
    </Dialog>
  );
}
