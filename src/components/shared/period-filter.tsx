"use client";

import { useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DatePicker, toISODate } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { CalendarRange, Check } from "lucide-react";

/** Intervalo de datas em "YYYY-MM-DD". null = sem limite (tudo). */
export interface DateRange {
  start: string | null;
  end: string | null;
  /** Rótulo amigável do período selecionado. */
  label: string;
}

export type PresetKey = "hoje" | "7d" | "30d" | "mes" | "tudo" | "custom";

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

/** Constrói um DateRange a partir de um preset, relativo a hoje. */
export function rangeFromPreset(preset: PresetKey): DateRange {
  const today = new Date();
  const todayIso = toISODate(today);
  switch (preset) {
    case "hoje":
      return { start: todayIso, end: todayIso, label: "Hoje" };
    case "7d":
      return { start: toISODate(addDays(today, -6)), end: todayIso, label: "Últimos 7 dias" };
    case "30d":
      return { start: toISODate(addDays(today, -29)), end: todayIso, label: "Últimos 30 dias" };
    case "mes": {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      return { start: toISODate(first), end: todayIso, label: "Este mês" };
    }
    case "tudo":
      return { start: null, end: null, label: "Todo o período" };
    default:
      return { start: todayIso, end: todayIso, label: "Personalizado" };
  }
}

/** Retorna true se a data (YYYY-MM-DD ou ISO) está dentro do intervalo. */
export function isInRange(dateValue: string | null | undefined, range: DateRange): boolean {
  if (!range.start && !range.end) return true; // tudo
  if (!dateValue) return false;
  const day = dateValue.split("T")[0];
  if (range.start && day < range.start) return false;
  if (range.end && day > range.end) return false;
  return true;
}

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "hoje", label: "Hoje" },
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "mes", label: "Este mês" },
  { key: "tudo", label: "Tudo" },
];

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Preset atualmente ativo, para destacar o botão. */
  activePreset: PresetKey;
  onPresetChange: (preset: PresetKey) => void;
}

function formatBr(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function PeriodFilter({ value, onChange, activePreset, onPresetChange }: Props) {
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(value.start ?? toISODate(new Date()));
  const [draftEnd, setDraftEnd] = useState(value.end ?? toISODate(new Date()));

  const customLabel = useMemo(() => {
    if (activePreset !== "custom") return "Personalizado";
    return `${formatBr(value.start)} – ${formatBr(value.end)}`;
  }, [activePreset, value.start, value.end]);

  function applyCustom() {
    const start = draftStart <= draftEnd ? draftStart : draftEnd;
    const end = draftStart <= draftEnd ? draftEnd : draftStart;
    onPresetChange("custom");
    onChange({ start, end, label: `${formatBr(start)} – ${formatBr(end)}` });
    setOpen(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/60 p-0.5">
        {PRESETS.map((preset) => {
          const active = activePreset === preset.key;
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => {
                onPresetChange(preset.key);
                onChange(rangeFromPreset(preset.key));
              }}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                active
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800",
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                activePreset === "custom"
                  ? "border-violet-500/50 bg-violet-500/15 text-violet-300"
                  : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700",
              )}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              {customLabel}
            </button>
          }
        />
        <PopoverContent className="w-auto p-3 bg-zinc-950 border-zinc-800 shadow-2xl space-y-3" align="end">
          <p className="text-xs font-medium text-zinc-300">Intervalo personalizado</p>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] uppercase tracking-wide text-zinc-500">De</label>
              <DatePicker value={draftStart} onChange={setDraftStart} disableFuture className="w-56" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wide text-zinc-500">Até</label>
              <DatePicker value={draftEnd} onChange={setDraftEnd} disableFuture className="w-56" />
            </div>
          </div>
          <button
            type="button"
            onClick={applyCustom}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Aplicar intervalo
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
