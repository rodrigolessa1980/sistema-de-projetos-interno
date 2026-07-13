"use client";

import { useMemo, useState } from "react";
import { StatusBadge, ComplexityBadge } from "@/components/shared/task-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import {
  formatDate,
  ALL_STATUSES,
  getStatusLabel,
  getStatusDotColor,
  COMPLEXITY_OPTIONS,
  getComplexityLabel,
  cn,
} from "@/lib/utils";
import { motion } from "@/lib/motion";
import { quickLogModuleIds } from "@/lib/worklog";
import {
  ListTodo,
  Search,
  Clock,
  AlertTriangle,
  Timer,
  Lock,
  Flame,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  LayoutList,
  FolderKanban,
  CalendarClock,
  CheckCircle2,
  Inbox,
  Ban,
} from "lucide-react";
import { useWorkSessionStore } from "@/stores/work-session-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "@/lib/router";
import { TaskActions } from "./task-actions";
import type { Task, TaskComplexity, TaskStatus, Project, User } from "@/types";

const ACTIVE_STATUSES: TaskStatus[] = ["EM_DESENVOLVIMENTO", "EM_REVISAO", "HOMOLOGACAO"];
const PENDING_STATUSES: TaskStatus[] = ["BACKLOG", "PLANEJADA"];
const CLOSED_STATUSES: TaskStatus[] = ["CONCLUIDA", "CANCELADA"];
const PAGE_SIZE = 25;

type TaskCategory =
  | "open"
  | "active"
  | "pending"
  | "overdue"
  | "urgent"
  | "blocked"
  | "done"
  | "all";

type DueFilter = "all" | "overdue" | "today" | "week" | "no_due";
type GroupBy = "none" | "status" | "project";
type SortBy = "updated" | "dueDate" | "priority" | "title" | "created";

const CATEGORY_META: Record<
  TaskCategory,
  { label: string; hint: string; icon: typeof ListTodo }
> = {
  open: {
    label: "Abertas",
    hint: "Tudo que ainda precisa de atenção (sem concluídas/canceladas)",
    icon: Inbox,
  },
  active: {
    label: "Em andamento",
    hint: "Desenvolvimento, revisão ou homologação",
    icon: Timer,
  },
  pending: {
    label: "Na fila",
    hint: "Backlog, planejadas e bloqueadas aguardando início",
    icon: LayoutList,
  },
  overdue: {
    label: "Atrasadas",
    hint: "Prazo vencido e ainda não finalizadas",
    icon: CalendarClock,
  },
  urgent: {
    label: "Urgentes",
    hint: "Marcadas como urgentes e ainda abertas",
    icon: Flame,
  },
  blocked: {
    label: "Bloqueadas",
    hint: "Com impedimento, dependência ou bloqueio de urgência",
    icon: Ban,
  },
  done: {
    label: "Concluídas",
    hint: "Tarefas finalizadas",
    icon: CheckCircle2,
  },
  all: {
    label: "Todas",
    hint: "Visão completa, incluindo arquivadas",
    icon: ListTodo,
  },
};

function isOverdue(task: Task, today: string) {
  return Boolean(
    task.dueDate &&
      task.dueDate < today &&
      !CLOSED_STATUSES.includes(task.status)
  );
}

function isBlockedTask(
  task: Task,
  getBlockersForTask: (taskId: string) => Task[]
) {
  return (
    task.status === "BLOQUEADA" ||
    getBlockersForTask(task.id).length > 0 ||
    Boolean(task.urgentBlockedById)
  );
}

function matchesCategory(
  task: Task,
  category: TaskCategory,
  today: string,
  getBlockersForTask: (taskId: string) => Task[]
) {
  switch (category) {
    case "open":
      return !CLOSED_STATUSES.includes(task.status);
    case "active":
      return ACTIVE_STATUSES.includes(task.status);
    case "pending":
      return (
        PENDING_STATUSES.includes(task.status) || task.status === "BLOQUEADA"
      );
    case "overdue":
      return isOverdue(task, today);
    case "urgent":
      return Boolean(task.isUrgent) && !CLOSED_STATUSES.includes(task.status);
    case "blocked":
      return isBlockedTask(task, getBlockersForTask);
    case "done":
      return task.status === "CONCLUIDA";
    case "all":
      return true;
  }
}

function matchesDueFilter(task: Task, dueFilter: DueFilter, today: string, in7Days: string) {
  switch (dueFilter) {
    case "overdue":
      return isOverdue(task, today);
    case "today":
      return task.dueDate === today;
    case "week":
      return Boolean(task.dueDate && task.dueDate >= today && task.dueDate <= in7Days);
    case "no_due":
      return !task.dueDate;
    default:
      return true;
  }
}

function sortTasks(tasks: Task[], sortBy: SortBy) {
  const copy = [...tasks];
  const priorityScore = (task: Task) => {
    let score = 0;
    if (task.isUrgent) score += 1000;
    if (task.status === "BLOQUEADA") score += 500;
    if (task.dueDate) score += Math.max(0, 300 - new Date(task.dueDate).getTime() / 86400000);
    return score;
  };

  copy.sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title, "pt-BR");
      case "dueDate": {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      case "created":
        return b.createdAt.localeCompare(a.createdAt);
      case "priority":
        return priorityScore(b) - priorityScore(a);
      case "updated":
      default:
        return b.updatedAt.localeCompare(a.updatedAt);
    }
  });

  return copy;
}

function TaskRow({
  task,
  index,
  projects,
  users,
  activeSessionTaskId,
  getBlockersForTask,
}: {
  task: Task;
  index: number;
  projects: Project[];
  users: User[];
  activeSessionTaskId?: string;
  getBlockersForTask: (taskId: string) => Task[];
}) {
  const assignee = users.find((u) => u.id === task.assigneeId);
  const project = projects.find((p) => p.id === task.projectId);
  const isOverdueRow =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "CONCLUIDA";
  const isBeingWorked = activeSessionTaskId === task.id;
  const tags = task.tags ?? [];
  const blockers = getBlockersForTask(task.id);

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: Math.min(index * 0.015, 0.3) }}
      className={cn(
        "transition-colors",
        isBeingWorked
          ? "bg-violet-500/5 hover:bg-violet-500/8"
          : "hover:bg-zinc-800/30"
      )}
    >
      <td className="px-4 py-3">
        <Link href={`/tasks/${task.id}`} className="group block">
          <div className="flex items-center gap-2">
            {isBeingWorked && (
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
            )}
            {task.isUrgent && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-[9px] font-bold text-red-400 shrink-0">
                <Flame className="w-2.5 h-2.5" /> URGENTE
              </span>
            )}
            {task.urgentBlockedById && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-orange-500/15 border border-orange-500/25 text-[9px] font-semibold text-orange-400 shrink-0">
                <Lock className="w-2.5 h-2.5" /> urgência
              </span>
            )}
            {!task.isUrgent && !task.urgentBlockedById && blockers.length > 0 ? (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/25 text-[9px] font-semibold text-red-400 shrink-0">
                <Lock className="w-2.5 h-2.5" />
                {blockers.length}
              </span>
            ) : task.status === "BLOQUEADA" && !isBeingWorked ? (
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            ) : null}
            <span
              className={cn(
                "text-sm transition-colors line-clamp-1",
                isBeingWorked
                  ? "text-violet-200 group-hover:text-violet-100 font-medium"
                  : "text-zinc-200 group-hover:text-violet-400"
              )}
            >
              {task.title}
            </span>
            {isBeingWorked && (
              <span className="ml-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-500/20 border border-violet-500/30">
                <Timer className="w-2.5 h-2.5 text-violet-400" />
                <span className="text-[9px] font-semibold text-violet-300">Ativo</span>
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1 max-w-xl">
              {task.description}
            </p>
          )}
          {tags.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </Link>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <StatusBadge status={task.status} />
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        {project && (
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: project.color }}
            />
            <span className="text-xs text-zinc-400 truncate max-w-28">{project.name}</span>
          </div>
        )}
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={assignee?.avatar} />
            <AvatarFallback className="text-[9px] bg-zinc-700">
              {assignee?.name?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-zinc-400 hidden xl:block">
            {assignee?.name?.split(" ")[0]}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 hidden xl:table-cell">
        <ComplexityBadge complexity={task.complexity} />
      </td>
      <td className="px-4 py-3 hidden xl:table-cell">
        <span
          className={`text-xs ${isOverdueRow ? "text-red-400 font-semibold" : "text-zinc-500"}`}
        >
          {formatDate(task.dueDate)}
        </span>
      </td>
      <td className="px-4 py-3 hidden xl:table-cell">
        <div className="flex items-center gap-1 text-xs">
          <Clock className="w-3 h-3 text-zinc-600" />
          <span className="text-zinc-400">
            {task.actualHours}/{task.estimatedHours}h
          </span>
        </div>
      </td>
      <td className="px-2 py-3 text-right">
        <TaskActions task={task} className="justify-end" />
      </td>
    </motion.tr>
  );
}

function TasksTable({
  tasks,
  projects,
  users,
  activeSessionTaskId,
  getBlockersForTask,
  embedded = false,
}: {
  tasks: Task[];
  projects: Project[];
  users: User[];
  activeSessionTaskId?: string;
  getBlockersForTask: (taskId: string) => Task[];
  embedded?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden",
        embedded
          ? "bg-zinc-900/40"
          : "bg-zinc-900/60 border border-zinc-800/50 rounded-xl"
      )}
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800/50">
            <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3">Tarefa</th>
            <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3 hidden md:table-cell">
              Status
            </th>
            <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3 hidden lg:table-cell">
              Projeto
            </th>
            <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3 hidden lg:table-cell">
              Responsável
            </th>
            <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3 hidden xl:table-cell">
              Complexidade
            </th>
            <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3 hidden xl:table-cell">
              Prazo
            </th>
            <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3 hidden xl:table-cell">
              Horas
            </th>
            <th className="text-right text-xs font-semibold text-zinc-500 px-4 py-3 w-20">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/30">
          {tasks.map((task, i) => (
            <TaskRow
              key={task.id}
              task={task}
              index={i}
              projects={projects}
              users={users}
              activeSessionTaskId={activeSessionTaskId}
              getBlockersForTask={getBlockersForTask}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface TasksListViewProps {
  isAdmin: boolean;
  userId?: string;
  onCreateTask?: () => void;
}

export function TasksListView({ isAdmin, userId, onCreateTask }: TasksListViewProps) {
  const { tasks, getBlockersForTask } = useTaskStore();
  const { projects, companies, modules } = useProjectStore();
  const { users } = useUserStore();
  const { activeSession } = useWorkSessionStore();

  const today = new Date().toISOString().split("T")[0];
  const in7Days = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<TaskCategory>("open");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [complexityFilter, setComplexityFilter] = useState<string>("all");
  const [dueFilter, setDueFilter] = useState<DueFilter>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [onlyActiveTimer, setOnlyActiveTimer] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>("status");
  const [sortBy, setSortBy] = useState<SortBy>("priority");
  const [page, setPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    () => new Set(["CONCLUIDA", "CANCELADA"])
  );

  const visibleProjects = isAdmin
    ? projects
    : projects.filter(
        (p) => p.developerIds.includes(userId ?? "") || p.ownerId === userId
      );

  const baseTasks = useMemo(() => {
    // Esconde as tarefas-andaime do lançamento rápido de horas (timesheet).
    const quickLog = quickLogModuleIds(modules);
    return tasks.filter((t) => {
      if (quickLog.has(t.moduleId)) return false;
      if (!isAdmin && t.assigneeId !== userId) return false;
      return true;
    });
  }, [tasks, isAdmin, userId, modules]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    baseTasks.forEach((t) => (t.tags ?? []).forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [baseTasks]);

  const categoryCounts = useMemo(() => {
    const counts = {} as Record<TaskCategory, number>;
    (Object.keys(CATEGORY_META) as TaskCategory[]).forEach((key) => {
      counts[key] = baseTasks.filter((t) =>
        matchesCategory(t, key, today, getBlockersForTask)
      ).length;
    });
    return counts;
  }, [baseTasks, today, getBlockersForTask]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return baseTasks.filter((t) => {
      if (!matchesCategory(t, category, today, getBlockersForTask)) return false;

      if (
        normalizedSearch &&
        !t.title.toLowerCase().includes(normalizedSearch) &&
        !t.description?.toLowerCase().includes(normalizedSearch) &&
        !(t.tags ?? []).some((tag) => tag.toLowerCase().includes(normalizedSearch))
      ) {
        return false;
      }

      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (projectFilter !== "all" && t.projectId !== projectFilter) return false;

      if (companyFilter !== "all") {
        const project = projects.find((p) => p.id === t.projectId);
        if (project?.companyId !== companyFilter) return false;
      }

      if (assigneeFilter !== "all" && t.assigneeId !== assigneeFilter) return false;
      if (complexityFilter !== "all" && t.complexity !== Number(complexityFilter)) {
        return false;
      }
      if (!matchesDueFilter(t, dueFilter, today, in7Days)) return false;
      if (tagFilter !== "all" && !(t.tags ?? []).includes(tagFilter)) return false;
      if (onlyActiveTimer && activeSession?.taskId !== t.id) return false;

      return true;
    });
  }, [
    baseTasks,
    category,
    search,
    statusFilter,
    projectFilter,
    companyFilter,
    assigneeFilter,
    complexityFilter,
    dueFilter,
    tagFilter,
    onlyActiveTimer,
    today,
    in7Days,
    projects,
    activeSession,
    getBlockersForTask,
  ]);

  const sortedTasks = useMemo(
    () => sortTasks(filteredTasks, sortBy),
    [filteredTasks, sortBy]
  );

  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedTasks =
    groupBy === "none"
      ? sortedTasks.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
      : sortedTasks;

  const groupedTasks = useMemo(() => {
    if (groupBy === "none") return null;

    const groups = new Map<string, Task[]>();

    paginatedTasks.forEach((task) => {
      const key =
        groupBy === "status"
          ? task.status
          : task.projectId;
      const list = groups.get(key) ?? [];
      list.push(task);
      groups.set(key, list);
    });

    const entries = Array.from(groups.entries());

    if (groupBy === "status") {
      entries.sort(
        (a, b) => ALL_STATUSES.indexOf(a[0] as TaskStatus) - ALL_STATUSES.indexOf(b[0] as TaskStatus)
      );
    } else {
      entries.sort((a, b) => {
        const pa = projects.find((p) => p.id === a[0])?.name ?? "";
        const pb = projects.find((p) => p.id === b[0])?.name ?? "";
        return pa.localeCompare(pb, "pt-BR");
      });
    }

    return entries;
  }, [groupBy, paginatedTasks, projects]);

  const activeAdvancedFilters =
    statusFilter !== "all" ||
    projectFilter !== "all" ||
    companyFilter !== "all" ||
    assigneeFilter !== "all" ||
    complexityFilter !== "all" ||
    dueFilter !== "all" ||
    tagFilter !== "all" ||
    onlyActiveTimer;

  const resetAdvancedFilters = () => {
    setStatusFilter("all");
    setProjectFilter("all");
    setCompanyFilter("all");
    setAssigneeFilter("all");
    setComplexityFilter("all");
    setDueFilter("all");
    setTagFilter("all");
    setOnlyActiveTimer(false);
    setPage(1);
  };

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const getGroupLabel = (key: string) => {
    if (groupBy === "status") return getStatusLabel(key as TaskStatus);
    return projects.find((p) => p.id === key)?.name ?? "Sem projeto";
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3">
        <p className="text-sm text-zinc-300">
          Visão geral de todas as tarefas{" "}
          {isAdmin ? "da equipe" : "atribuídas a você"}.
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          Use as categorias abaixo para reduzir a lista, depois refine com filtros
          avançados. Por padrão, tarefas concluídas ficam ocultas na categoria{" "}
          <span className="text-zinc-400">Abertas</span>.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(CATEGORY_META) as TaskCategory[]).map((key) => {
          const meta = CATEGORY_META[key];
          const Icon = meta.icon;
          const count = categoryCounts[key];
          const active = category === key;

          return (
            <button
              key={key}
              type="button"
              title={meta.hint}
              onClick={() => {
                setCategory(key);
                setPage(1);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-violet-500/40 bg-violet-500/15 text-violet-200"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              )}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {meta.label}
              <Badge
                variant="outline"
                className={cn(
                  "h-5 min-w-5 px-1.5 text-[10px] border-zinc-700",
                  active && "border-violet-500/30 text-violet-300"
                )}
              >
                {count}
              </Badge>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar por título, descrição ou tag..."
              className="pl-9 bg-zinc-800/50 border-zinc-700/50 text-zinc-100 h-9"
            />
          </div>

          <Select
            value={sortBy}
            onValueChange={(value) => value && setSortBy(value as SortBy)}
          >
            <SelectTrigger className="w-44 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-9">
              <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-zinc-500" />
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700/50">
              <SelectItem value="priority">Prioridade</SelectItem>
              <SelectItem value="dueDate">Prazo</SelectItem>
              <SelectItem value="updated">Atualização</SelectItem>
              <SelectItem value="created">Criação</SelectItem>
              <SelectItem value="title">Título (A–Z)</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={groupBy}
            onValueChange={(value) => {
              if (!value) return;
              setGroupBy(value as GroupBy);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-9">
              <FolderKanban className="w-3.5 h-3.5 mr-1 text-zinc-500" />
              <SelectValue placeholder="Agrupar" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700/50">
              <SelectItem value="status">Agrupar por status</SelectItem>
              <SelectItem value="project">Agrupar por projeto</SelectItem>
              <SelectItem value="none">Lista única</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced((v) => !v)}
            className={cn(
              "h-9 border-zinc-700/50 bg-zinc-800/50 text-zinc-300",
              showAdvanced && "border-violet-500/30 text-violet-300"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
            Filtros avançados
            {activeAdvancedFilters && (
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-violet-400" />
            )}
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 ml-1 transition-transform",
                showAdvanced && "rotate-180"
              )}
            />
          </Button>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-zinc-800/40">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-500">Status</label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value ?? "all");
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700/50">
                  <SelectItem value="all">Todos os status</SelectItem>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {getStatusLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-500">Projeto</label>
              <Select
                value={projectFilter}
                onValueChange={(value) => {
                  setProjectFilter(value ?? "all");
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-9">
                  <SelectValue placeholder="Projeto" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700/50">
                  <SelectItem value="all">Todos os projetos</SelectItem>
                  {visibleProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {companies.length > 0 && (
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-500">Empresa</label>
                <Select
                  value={companyFilter}
                  onValueChange={(value) => {
                    setCompanyFilter(value ?? "all");
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-9">
                    <SelectValue placeholder="Empresa" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700/50">
                    <SelectItem value="all">Todas as empresas</SelectItem>
                    {companies.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.shortName || c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {isAdmin && (
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-500">Responsável</label>
                <Select
                  value={assigneeFilter}
                  onValueChange={(value) => {
                    setAssigneeFilter(value ?? "all");
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-9">
                    <SelectValue placeholder="Responsável" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700/50">
                    <SelectItem value="all">Todos</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-500">Complexidade</label>
              <Select
                value={complexityFilter}
                onValueChange={(value) => {
                  setComplexityFilter(value ?? "all");
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-9">
                  <SelectValue placeholder="Complexidade" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700/50">
                  <SelectItem value="all">Todas</SelectItem>
                  {COMPLEXITY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={String(c)}>
                      {c} — {getComplexityLabel(c as TaskComplexity)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-500">Prazo</label>
              <Select
                value={dueFilter}
                onValueChange={(value) => {
                  if (value) setDueFilter(value as DueFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-9">
                  <SelectValue placeholder="Prazo" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700/50">
                  <SelectItem value="all">Qualquer prazo</SelectItem>
                  <SelectItem value="overdue">Atrasadas</SelectItem>
                  <SelectItem value="today">Vence hoje</SelectItem>
                  <SelectItem value="week">Próximos 7 dias</SelectItem>
                  <SelectItem value="no_due">Sem prazo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {allTags.length > 0 && (
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-500">Tag</label>
                <Select
                  value={tagFilter}
                  onValueChange={(value) => {
                    setTagFilter(value ?? "all");
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-9">
                    <SelectValue placeholder="Tag" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700/50">
                    <SelectItem value="all">Todas as tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setOnlyActiveTimer((v) => !v);
                  setPage(1);
                }}
                className={cn(
                  "w-full h-9 rounded-md border text-xs font-medium transition-colors",
                  onlyActiveTimer
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-zinc-700/50 bg-zinc-800/50 text-zinc-400 hover:text-zinc-200"
                )}
              >
                <Timer className="w-3.5 h-3.5 inline mr-1.5" />
                Cronômetro ativo
              </button>
            </div>

            {activeAdvancedFilters && (
              <div className="flex items-end sm:col-span-2 lg:col-span-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetAdvancedFilters}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Limpar filtros avançados
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
        <span>
          Exibindo{" "}
          <span className="text-zinc-300 font-medium">{sortedTasks.length}</span>{" "}
          de{" "}
          <span className="text-zinc-300 font-medium">{baseTasks.length}</span>{" "}
          tarefa{baseTasks.length !== 1 ? "s" : ""}
          {groupBy === "none" && sortedTasks.length > PAGE_SIZE && (
            <>
              {" "}
              · página {safePage} de {totalPages}
            </>
          )}
        </span>
        <span className="text-zinc-600">{CATEGORY_META[category].hint}</span>
      </div>

      {sortedTasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="Nenhuma tarefa encontrada"
          description="Tente outra categoria ou ajuste os filtros avançados."
          action={
            onCreateTask ? { label: "Criar Tarefa", onClick: onCreateTask } : undefined
          }
        />
      ) : groupBy !== "none" && groupedTasks ? (
        <div className="space-y-3">
          {groupedTasks.map(([key, groupTasks]) => {
            const collapsed = collapsedGroups.has(key);
            const dotColor =
              groupBy === "status"
                ? getStatusDotColor(key as TaskStatus)
                : undefined;
            const projectColor =
              groupBy === "project"
                ? projects.find((p) => p.id === key)?.color
                : undefined;

            return (
              <div
                key={key}
                className="rounded-xl border border-zinc-800/50 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleGroup(key)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-zinc-900/70 hover:bg-zinc-900 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {collapsed ? (
                      <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                    )}
                    {(dotColor || projectColor) && (
                      <span
                        className={cn("w-2 h-2 rounded-full shrink-0", dotColor)}
                        style={projectColor ? { background: projectColor } : undefined}
                      />
                    )}
                    <span className="text-sm font-medium text-zinc-200 truncate">
                      {getGroupLabel(key)}
                    </span>
                  </div>
                  <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                    {groupTasks.length}
                  </Badge>
                </button>
                {!collapsed && (
                  <TasksTable
                    embedded
                    tasks={groupTasks}
                    projects={projects}
                    users={users}
                    activeSessionTaskId={activeSession?.taskId}
                    getBlockersForTask={getBlockersForTask}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <TasksTable
            tasks={paginatedTasks}
            projects={projects}
            users={users}
            activeSessionTaskId={activeSession?.taskId}
            getBlockersForTask={getBlockersForTask}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="border-zinc-700/50 bg-zinc-800/50 text-zinc-300"
              >
                Anterior
              </Button>
              <span className="text-xs text-zinc-500 px-2">
                {safePage} / {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="border-zinc-700/50 bg-zinc-800/50 text-zinc-300"
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
