"use client";

import { CircleHelp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

type BurndownHelpProps = {
  scopeLabel: string;
};

const BURNDOWN_SERIES = [
  {
    name: "Estimado (roxo)",
    formula: "total de tarefas × (1 − dia ÷ 6) × 0,8",
    note: "Curva ideal decrescente ao longo dos 7 dias, com base no total de tarefas do escopo.",
  },
  {
    name: "Real (verde)",
    formula: "tarefas concluídas × (1 − dia ÷ 7) × 1,1",
    note: "Projeção visual usando a quantidade atual de tarefas concluídas no escopo.",
  },
];

export function BurndownHelp({ scopeLabel }: BurndownHelpProps) {
  return (
    <Popover>
      <PopoverTrigger
        className="inline-flex items-center justify-center rounded-full text-zinc-500 hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
        aria-label="Como funciona o Burndown"
      >
        <CircleHelp className="size-4" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-[22rem] max-h-[min(70vh,28rem)] overflow-y-auto bg-zinc-900 border-zinc-700/50 text-zinc-300 p-4"
      >
        <PopoverHeader className="mb-3">
          <PopoverTitle className="text-zinc-100 text-sm">Burndown</PopoverTitle>
          <PopoverDescription className="text-xs text-zinc-500 leading-relaxed">
            Compara uma linha estimada com uma linha real nos últimos 7 dias. Os valores são
            calculados no cliente a partir do estado atual das tarefas — não há histórico salvo
            dia a dia no banco.
          </PopoverDescription>
        </PopoverHeader>

        <div className="space-y-3">
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-2.5">
            <p className="text-xs font-semibold text-zinc-200">Escopo atual</p>
            <p className="mt-1 text-[11px] leading-relaxed text-violet-300/90">{scopeLabel}</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">
              Definido pelo seletor no topo da página: &quot;Todos os projetos&quot; agrega todas
              as tarefas carregadas; ao escolher um projeto, entram só as tarefas dele.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-2.5">
            <p className="text-xs font-semibold text-zinc-200">O que não entra</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">
              Não há filtro por usuário ou responsável. Todas as tarefas do escopo contam,
              independentemente de quem está atribuído.
            </p>
          </div>

          <ul className="space-y-3">
            {BURNDOWN_SERIES.map((series) => (
              <li key={series.name} className="rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-2.5">
                <p className="text-xs font-semibold text-zinc-200">{series.name}</p>
                <p className="mt-1 font-mono text-[11px] leading-relaxed text-violet-300/90">{series.formula}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">{series.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
