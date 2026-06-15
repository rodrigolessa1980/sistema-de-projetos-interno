"use client";

import { useMemo, useState } from "react";
import { eachDayOfInterval } from "date-fns";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "@/lib/motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MultiSelectFilter } from "@/components/shared/multi-select-filter";
import { CalendarDays, Clock, LayoutGrid, CalendarRange, Download } from "lucide-react";
import { PrintButton } from "@/components/shared/print-button";
import {
  PeriodFilter,
  rangeFromPreset,
  isInRange,
  type DateRange,
  type PresetKey,
} from "@/components/shared/period-filter";
import { toISODate } from "@/components/ui/date-picker";
import { ActivityCalendar } from "@/components/shared/activity-calendar";

type ViewMode = "calendar" | "matrix";

/** Teto de colunas (≈ 1 ano) — evita travar só em períodos absurdos; cabe o ano inteiro. */
const MAX_DAYS = 366;

function fmtHours(h: number): string {
  if (h <= 0) return "";
  return h >= 1 ? h.toFixed(1) : `${Math.round(h * 60)}m`;
}

export default function DailyHoursReportPage() {
  const { tasks, timeLogs } = useTaskStore();
  const { projects, modules } = useProjectStore();
  const { users } = useUserStore();
  const { isAdmin, user } = useAuth();

  const [view, setView] = useState<ViewMode>("calendar");
  const [preset, setPreset] = useState<PresetKey>("tudo");
  const [range, setRange] = useState<DateRange>(() => rangeFromPreset("tudo"));
  const [hiddenProjects, setHiddenProjects] = useState<Set<string>>(new Set());
  const [hiddenDevs, setHiddenDevs] = useState<Set<string>>(new Set());

  // Opções de filtro
  const projectOptions = useMemo(
    () => projects.map((p) => ({ id: p.id, label: p.name, color: p.color })),
    [projects],
  );
  // Devs = usuários que têm pelo menos 1 registro de hora
  const devOptions = useMemo(() => {
    const ids = new Set(timeLogs.map((tl) => tl.userId));
    return users.filter((u) => ids.has(u.id)).map((u) => ({ id: u.id, label: u.name }));
  }, [timeLogs, users]);

  // Logs visíveis (permissão + projeto + dev + período)
  const visibleLogs = useMemo(() => {
    return timeLogs.filter((tl) => {
      if (!isAdmin && tl.userId !== user?.id) return false;
      if (hiddenDevs.has(tl.userId)) return false;
      if (!isInRange(tl.date, range)) return false;
      const task = tasks.find((t) => t.id === tl.taskId);
      if (task && hiddenProjects.has(task.projectId)) return false;
      return true;
    });
  }, [timeLogs, tasks, isAdmin, user?.id, range, hiddenProjects, hiddenDevs]);

  // Colunas de dias do período (ascendente). Em "Tudo", deriva do min/max dos logs.
  const days = useMemo<string[]>(() => {
    let startIso = range.start;
    let endIso = range.end;
    if (!startIso || !endIso) {
      if (visibleLogs.length === 0) return [];
      const dates = visibleLogs.map((tl) => tl.date.split("T")[0]).sort();
      startIso = startIso ?? dates[0];
      endIso = endIso ?? dates[dates.length - 1];
    }
    const all = eachDayOfInterval({ start: parseISO(startIso), end: parseISO(endIso) }).map(toISODate);
    return all.length > MAX_DAYS ? all.slice(all.length - MAX_DAYS) : all;
  }, [range.start, range.end, visibleLogs]);

  const daySet = useMemo(() => new Set(days), [days]);

  // Mapa horas por (userId|dia)
  const hoursByUserDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const tl of visibleLogs) {
      const day = tl.date.split("T")[0];
      if (!daySet.has(day)) continue;
      const key = `${tl.userId}|${day}`;
      map.set(key, (map.get(key) ?? 0) + tl.hours);
    }
    return map;
  }, [visibleLogs, daySet]);

  // Usuários com pelo menos 1 hora no período (linhas)
  const rows = useMemo(() => {
    const candidates = (isAdmin ? users : users.filter((u) => u.id === user?.id))
      .filter((u) => !hiddenDevs.has(u.id));
    return candidates
      .map((u) => {
        const perDay = days.map((d) => hoursByUserDay.get(`${u.id}|${d}`) ?? 0);
        const total = perDay.reduce((a, b) => a + b, 0);
        return { user: u, perDay, total };
      })
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [users, isAdmin, user?.id, days, hoursByUserDay, hiddenDevs]);

  // Totais por dia + geral + pico (para o heatmap)
  const dayTotals = days.map((_, i) => rows.reduce((acc, r) => acc + r.perDay[i], 0));
  const grandTotal = dayTotals.reduce((a, b) => a + b, 0);
  const maxCell = Math.max(1, ...rows.flatMap((r) => r.perDay));
  const activeDays = dayTotals.filter((h) => h > 0).length;

  const todayIso = toISODate(new Date());

  // Exporta os registros ativos no filtro (período + projetos + devs) como CSV.
  function exportCsv() {
    const sep = ";";
    const esc = (v: string | number) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = ["Data", "Desenvolvedor", "Projeto", "Atividade", "Descrição", "Horas", "Status"];
    const sorted = [...visibleLogs].sort((a, b) => a.date.localeCompare(b.date));
    const lines = sorted.map((l) => {
      const task = tasks.find((t) => t.id === l.taskId);
      const project = task ? projects.find((p) => p.id === task.projectId) : null;
      const dev = users.find((u) => u.id === l.userId);
      const mod = task?.moduleId ? modules.find((m) => m.id === task.moduleId) : null;
      return [
        l.date.split("T")[0],
        dev?.name ?? "",
        project?.name ?? "",
        task?.title ?? "",
        l.description ?? "",
        String(l.hours).replace(".", ","),
        mod?.status ?? task?.status ?? "",
      ].map(esc).join(sep);
    });
    const csv = String.fromCharCode(0xFEFF) + [header.map(esc).join(sep), ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `horas_${range.start ?? "inicio"}_${range.end ?? "tudo"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 w-full space-y-6" data-print-content data-print-footer
      data-date={new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}>
      <div className="flex items-start justify-between gap-4 flex-wrap" data-print-header>
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-violet-400" />
            Horas por Dia
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Horas por desenvolvedor · {range.label}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportCsv} variant="outline" size="sm" className="gap-1.5 h-8 text-xs border-zinc-700 bg-zinc-800/50 text-zinc-200 hover:bg-zinc-800">
            <Download className="w-3.5 h-3.5" /> Exportar CSV
          </Button>
          <PrintButton />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3" data-print-hide>
        {/* Seletor de visão */}
        <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/60 p-0.5">
          {([
            { key: "calendar", label: "Calendário", icon: CalendarRange },
            { key: "matrix", label: "Matriz", icon: LayoutGrid },
          ] as const).map((opt) => {
            const Icon = opt.icon;
            const active = view === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setView(opt.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  active ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {opt.label}
              </button>
            );
          })}
        </div>

        <PeriodFilter value={range} onChange={setRange} activePreset={preset} onPresetChange={setPreset} />
        <MultiSelectFilter label="Projetos" options={projectOptions} hidden={hiddenProjects} onChange={setHiddenProjects} />
        {isAdmin && (
          <MultiSelectFilter label="Devs" options={devOptions} hidden={hiddenDevs} onChange={setHiddenDevs} />
        )}
      </div>

      {view === "calendar" ? (
        <ActivityCalendar range={range} hiddenProjects={hiddenProjects} hiddenDevs={hiddenDevs} />
      ) : (
      <>
      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total no período", value: `${grandTotal.toFixed(1)}h`, color: "text-violet-400", bg: "bg-violet-500/10" },
          { label: "Desenvolvedores", value: rows.length, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Dias com registro", value: `${activeDays}/${days.length}`, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Média / dia ativo", value: `${activeDays > 0 ? (grandTotal / activeDays).toFixed(1) : "0"}h`, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-3 ${s.bg}`}>
              <Clock className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-medium text-zinc-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Matriz desenvolvedor × dia */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl overflow-hidden"
      >
        {days.length === 0 || rows.length === 0 ? (
          <div className="text-center py-12 text-zinc-600 text-sm">
            Nenhuma hora registrada para os filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800/50">
                  <th className="sticky left-0 z-10 bg-zinc-900/95 px-4 py-2.5 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wide min-w-[180px]">
                    Desenvolvedor
                  </th>
                  {days.map((d) => {
                    const date = parseISO(d);
                    const isToday = d === todayIso;
                    return (
                      <th key={d} className={`px-1.5 py-2 text-center text-[10px] font-medium whitespace-nowrap ${isToday ? "text-violet-300" : "text-zinc-500"}`}>
                        <div className="capitalize">{format(date, "EEEEEE", { locale: ptBR })}</div>
                        <div className={isToday ? "font-bold" : "text-zinc-400"}>{format(date, "dd/MM")}</div>
                      </th>
                    );
                  })}
                  <th className="sticky right-0 z-10 bg-zinc-900/95 px-3 py-2.5 text-right text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {rows.map((row) => (
                  <tr key={row.user.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="sticky left-0 z-10 bg-zinc-900/95 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6 shrink-0">
                          <AvatarImage src={row.user.avatar} />
                          <AvatarFallback className="text-[8px] bg-zinc-700">{row.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-zinc-200 truncate">{row.user.name}</span>
                      </div>
                    </td>
                    {row.perDay.map((h, i) => (
                      <td
                        key={days[i]}
                        className="px-1.5 py-2 text-center text-xs tabular-nums"
                        style={h > 0 ? { background: `rgba(139, 92, 246, ${0.12 + (h / maxCell) * 0.55})` } : undefined}
                      >
                        <span className={h > 0 ? "text-zinc-100 font-medium" : "text-zinc-700"}>
                          {h > 0 ? fmtHours(h) : "·"}
                        </span>
                      </td>
                    ))}
                    <td className="sticky right-0 z-10 bg-zinc-900/95 px-3 py-2 text-right text-xs font-bold text-violet-300 tabular-nums">
                      {row.total.toFixed(1)}h
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-zinc-700/50 bg-zinc-900/80">
                  <td className="sticky left-0 z-10 bg-zinc-900/95 px-4 py-2.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">
                    Total / dia
                  </td>
                  {dayTotals.map((t, i) => (
                    <td key={days[i]} className="px-1.5 py-2.5 text-center text-xs font-semibold text-zinc-300 tabular-nums">
                      {t > 0 ? t.toFixed(1) : "·"}
                    </td>
                  ))}
                  <td className="sticky right-0 z-10 bg-zinc-900/95 px-3 py-2.5 text-right text-xs font-bold text-violet-200 tabular-nums">
                    {grandTotal.toFixed(1)}h
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </motion.div>

      {days.length >= MAX_DAYS && (
        <p className="text-[11px] text-zinc-600" data-print-hide>
          Mostrando os últimos {MAX_DAYS} dias do período. Refine o intervalo para ver datas anteriores.
        </p>
      )}
      </>
      )}
    </div>
  );
}
