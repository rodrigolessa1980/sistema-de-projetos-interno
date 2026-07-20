import type { ComponentType } from "react";

type PageModule = { default: ComponentType<unknown> };

export const pageLoaders = {
  root: () => import("@/app/page"),
  login: () => import("@/app/login/page"),
  register: () => import("@/app/register/page"),
  dashboard: () => import("@/app/dashboard/page"),
  companies: () => import("@/app/companies/page"),
  dependencies: () => import("@/app/dependencies/page"),
  epics: () => import("@/app/epics/page"),
  gantt: () => import("@/app/gantt/page"),
  kanban: () => import("@/app/kanban/page"),
  metrics: () => import("@/app/metrics/page"),
  modules: () => import("@/app/modules/page"),
  moduleDetail: () => import("@/app/modules/[id]/page"),
  myQueue: () => import("@/app/my-queue/page"),
  profile: () => import("@/app/profile/page"),
  projects: () => import("@/app/projects/page"),
  projectDetail: () => import("@/app/projects/[id]/page"),
  queue: () => import("@/app/queue/page"),
  hoursReport: () => import("@/app/reports/hours/page"),
  dailyHoursReport: () => import("@/app/reports/daily/page"),
  overviewReport: () => import("@/app/reports/overview/page"),
  productivityReport: () => import("@/app/reports/productivity/page"),
  projectsReport: () => import("@/app/reports/projects/page"),
  projectReportDetail: () => import("@/app/reports/projects/[id]/page"),
  taskDetail: () => import("@/app/tasks/[id]/page"),
  timeLogs: () => import("@/app/time-logs/page"),
  users: () => import("@/app/users/page"),
  trash: () => import("@/app/trash/page"),
  audit: () => import("@/app/audit/page"),
} as const;

/** Rotas principais da sidebar — pré-carregadas após login. */
export const mainPageLoaders: Array<() => Promise<PageModule>> = [
  pageLoaders.dashboard,
  pageLoaders.projects,
  pageLoaders.queue,
  pageLoaders.modules,
  pageLoaders.epics,
  pageLoaders.companies,
  pageLoaders.myQueue,
  pageLoaders.kanban,
  pageLoaders.gantt,
  pageLoaders.dependencies,
  pageLoaders.metrics,
  pageLoaders.timeLogs,
  pageLoaders.productivityReport,
  pageLoaders.hoursReport,
  pageLoaders.dailyHoursReport,
  pageLoaders.projectsReport,
  pageLoaders.overviewReport,
  pageLoaders.users,
  pageLoaders.profile,
];

const loaderByHref: Record<string, () => Promise<PageModule>> = {
  "/dashboard": pageLoaders.dashboard,
  "/projects": pageLoaders.projects,
  "/queue": pageLoaders.queue,
  "/modules": pageLoaders.modules,
  "/epics": pageLoaders.epics,
  "/companies": pageLoaders.companies,
  "/my-queue": pageLoaders.myQueue,
  "/kanban": pageLoaders.kanban,
  "/gantt": pageLoaders.gantt,
  "/dependencies": pageLoaders.dependencies,
  "/metrics": pageLoaders.metrics,
  "/time-logs": pageLoaders.timeLogs,
  "/reports/productivity": pageLoaders.productivityReport,
  "/reports/hours": pageLoaders.hoursReport,
  "/reports/daily": pageLoaders.dailyHoursReport,
  "/reports/projects": pageLoaders.projectsReport,
  "/reports/overview": pageLoaders.overviewReport,
  "/users": pageLoaders.users,
  "/profile": pageLoaders.profile,
  "/trash": pageLoaders.trash,
  "/audit": pageLoaders.audit,
};

let preloadPromise: Promise<void> | null = null;

export function preloadMainPages() {
  if (!preloadPromise) {
    preloadPromise = Promise.all(mainPageLoaders.map((loader) => loader()))
      .then(() => undefined)
      .catch(() => undefined);
  }
  return preloadPromise;
}

export function preloadPageByHref(href: string) {
  const loader = loaderByHref[href];
  if (!loader) return;
  void loader().catch(() => undefined);
}
