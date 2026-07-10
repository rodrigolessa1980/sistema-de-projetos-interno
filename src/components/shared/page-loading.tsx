"use client";

import { Loader2 } from "lucide-react";

/**
 * Estado de carregamento padrão das páginas de lista. Enquanto o `hasLoaded`
 * do store for false, mostre isto em vez do EmptyState — assim o usuário nunca
 * vê "Nenhum item" (falso vazio) antes de a busca terminar.
 */
export function PageLoading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}
