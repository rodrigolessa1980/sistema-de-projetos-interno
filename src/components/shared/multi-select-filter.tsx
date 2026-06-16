"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  id: string;
  label: string;
  color?: string;
}

interface Props {
  label: string;
  options: FilterOption[];
  /** Conjunto de ids OCULTOS (desmarcados). Vazio = todos visíveis. */
  hidden: Set<string>;
  onChange: (hidden: Set<string>) => void;
}

/** Filtro de múltipla escolha por checkbox. Trabalha com o conjunto de ids ocultos (vazio = todos). */
export function MultiSelectFilter({ label, options, hidden, onChange }: Props) {
  const total = options.length;
  const selectedCount = total - options.filter((o) => hidden.has(o.id)).length;
  const allShown = hidden.size === 0;

  function toggle(id: string) {
    const next = new Set(hidden);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-xs font-medium text-zinc-300 hover:border-zinc-700 transition-colors"
          >
            {label}: <span className="text-zinc-400">{allShown ? "Todos" : `${selectedCount}/${total}`}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        }
      />
      <PopoverContent className="w-60 p-2 bg-zinc-950 border-zinc-800 shadow-2xl" align="start">
        <div className="flex items-center justify-between px-1 pb-2 mb-1 border-b border-zinc-800">
          <span className="text-[11px] font-semibold text-zinc-400">{label}</span>
          <div className="flex gap-2 text-[11px]">
            <button type="button" onClick={() => onChange(new Set())} className="text-violet-400 hover:text-violet-300">Todos</button>
            <button type="button" onClick={() => onChange(new Set(options.map((o) => o.id)))} className="text-zinc-500 hover:text-zinc-300">Nenhum</button>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto space-y-0.5">
          {options.map((o) => {
            const checked = !hidden.has(o.id);
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => toggle(o.id)}
                className="w-full flex items-center gap-2 px-1.5 py-1.5 rounded-md text-left hover:bg-zinc-900 transition-colors"
              >
                <span className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                  checked ? "bg-violet-600 border-violet-600" : "border-zinc-600",
                )}>
                  {checked && <Check className="w-3 h-3 text-white" />}
                </span>
                {o.color && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: o.color }} />}
                <span className="text-xs text-zinc-200 truncate">{o.label}</span>
              </button>
            );
          })}
          {options.length === 0 && <p className="text-xs text-zinc-600 px-1.5 py-2">Nenhuma opção.</p>}
        </div>
      </PopoverContent>
    </Popover>
  );
}
