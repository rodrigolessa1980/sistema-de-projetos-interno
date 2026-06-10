"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isToday,
  isAfter,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

/** Converte uma Date para "YYYY-MM-DD" usando o fuso local (sem o bug do toISOString). */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

/** Converte "YYYY-MM-DD" para uma Date local (evita o off-by-one de fuso horário). */
function parseLocal(value?: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

interface DatePickerProps {
  /** Data selecionada no formato "YYYY-MM-DD". */
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Bloqueia a seleção de datas futuras (útil para registrar trabalho já realizado). */
  disableFuture?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecionar data...",
  disableFuture = false,
  className,
}: DatePickerProps) {
  const selected = parseLocal(value);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(selected ?? new Date());

  const monthStart = startOfMonth(viewDate);
  const days = eachDayOfInterval({ start: monthStart, end: endOfMonth(viewDate) });
  const leadingBlanks = getDay(monthStart); // 0 = domingo
  const today = startOfDay(new Date());

  function handleSelect(day: Date) {
    onChange(toISODate(day));
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2 h-9 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-left outline-none transition-colors hover:border-zinc-600 focus:border-violet-500/50",
              selected ? "text-zinc-200" : "text-zinc-500",
              className,
            )}
          >
            <CalendarIcon className="w-4 h-4 text-violet-400 shrink-0" />
            <span className="flex-1 truncate">
              {selected ? format(selected, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : placeholder}
            </span>
          </button>
        }
      />
      <PopoverContent className="w-auto p-3 bg-zinc-950 border-zinc-800 shadow-2xl" align="start">
        {/* Cabeçalho com navegação de mês */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => setViewDate((d) => subMonths(d, 1))}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-zinc-200 capitalize">
            {format(viewDate, "MMMM yyyy", { locale: ptBR })}
          </span>
          <button
            type="button"
            onClick={() => setViewDate((d) => addMonths(d, 1))}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((w, i) => (
            <div
              key={i}
              className="h-7 flex items-center justify-center text-[10px] font-medium text-zinc-600"
            >
              {w}
            </div>
          ))}
        </div>

        {/* Grade de dias */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <div key={`blank-${i}`} className="h-8" />
          ))}
          {days.map((day) => {
            const isSelected = selected ? toISODate(day) === toISODate(selected) : false;
            const isFuture = disableFuture && isAfter(startOfDay(day), today);
            return (
              <button
                key={day.toISOString()}
                type="button"
                disabled={isFuture}
                onClick={() => handleSelect(day)}
                className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-md text-xs transition-colors",
                  isSelected
                    ? "bg-violet-600 text-white font-semibold"
                    : isFuture
                      ? "text-zinc-700 cursor-not-allowed"
                      : "text-zinc-300 hover:bg-zinc-800",
                  !isSelected && isToday(day) && "ring-1 ring-violet-500/50",
                )}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
