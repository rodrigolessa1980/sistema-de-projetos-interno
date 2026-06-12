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

const RADAR_METRICS = [
  {
    name: "Estimativa",
    formula: "(1 − |horas reais − horas estimadas| ÷ horas estimadas) × 100",
    note: "Quanto mais perto o total de horas reais ficou do estimado, maior o score.",
  },
  {
    name: "Velocidade",
    formula: "min(100, (throughput ÷ 10) × 100)",
    note: "Throughput = tarefas concluídas ÷ projetos ativos. Referência: 10 conclusões por projeto = 100%.",
  },
  {
    name: "Qualidade",
    formula: "100 − taxa de retrabalho",
    note: "Retrabalho = % de tarefas com status BLOQUEADA sobre o total.",
  },
  {
    name: "Entrega",
    formula: "min(100, (tarefas concluídas ÷ total de tarefas) × 100)",
    note: "Taxa de conclusão das tarefas no escopo filtrado.",
  },
  {
    name: "Eficiência",
    formula: "min(100, (horas estimadas ÷ horas reais) × 100)",
    note: "Gastar menos que o estimado aumenta o score. Sem estimativa, usa 50% como padrão.",
  },
];

export function PerformanceRadarHelp() {
  return (
    <Popover>
      <PopoverTrigger
        className="inline-flex items-center justify-center rounded-full text-zinc-500 hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
        aria-label="Como funciona o Radar de Performance"
      >
        <CircleHelp className="size-4" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-[22rem] max-h-[min(70vh,28rem)] overflow-y-auto bg-zinc-900 border-zinc-700/50 text-zinc-300 p-4"
      >
        <PopoverHeader className="mb-3">
          <PopoverTitle className="text-zinc-100 text-sm">Radar de Performance</PopoverTitle>
          <PopoverDescription className="text-xs text-zinc-500 leading-relaxed">
            Cada eixo vai de 0 a 100%, calculado no cliente a partir das tarefas e projetos
            carregados. O filtro de projeto afeta as tarefas; projetos ativos entram no cálculo de velocidade.
          </PopoverDescription>
        </PopoverHeader>

        <ul className="space-y-3">
          {RADAR_METRICS.map((metric) => (
            <li key={metric.name} className="rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-2.5">
              <p className="text-xs font-semibold text-zinc-200">{metric.name}</p>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-violet-300/90">{metric.formula}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">{metric.note}</p>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
