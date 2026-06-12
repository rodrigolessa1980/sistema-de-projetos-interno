import { lazy, Suspense, type ComponentType } from "react";
import { RouterProvider, usePathname } from "@/lib/router";

function lazyPage<T extends ComponentType<unknown>>(
  loader: () => Promise<{ default: T }>,
) {
  return lazy(loader);
}

const RootPage = lazyPage(() => import("@/app/page"));
const LoginPage = lazyPage(() => import("@/app/login/page"));
const RegisterPage = lazyPage(() => import("@/app/register/page"));
const DashboardPage = lazyPage(() => import("@/app/dashboard/page"));
const CompaniesPage = lazyPage(() => import("@/app/companies/page"));
const DependenciesPage = lazyPage(() => import("@/app/dependencies/page"));
const EpicsPage = lazyPage(() => import("@/app/epics/page"));
const GanttPage = lazyPage(() => import("@/app/gantt/page"));
const KanbanPage = lazyPage(() => import("@/app/kanban/page"));
const MetricsPage = lazyPage(() => import("@/app/metrics/page"));
const ModulesPage = lazyPage(() => import("@/app/modules/page"));
const MyQueuePage = lazyPage(() => import("@/app/my-queue/page"));
const ProfilePage = lazyPage(() => import("@/app/profile/page"));
const ProjectsPage = lazyPage(() => import("@/app/projects/page"));
const ProjectDetailPage = lazyPage(() => import("@/app/projects/[id]/page"));
const QueuePage = lazyPage(() => import("@/app/queue/page"));
const HoursReportPage = lazyPage(() => import("@/app/reports/hours/page"));
const OverviewReportPage = lazyPage(() => import("@/app/reports/overview/page"));
const ProductivityReportPage = lazyPage(() => import("@/app/reports/productivity/page"));
const ProjectsReportPage = lazyPage(() => import("@/app/reports/projects/page"));
const ProjectReportDetailPage = lazyPage(() => import("@/app/reports/projects/[id]/page"));
const TasksPage = lazyPage(() => import("@/app/tasks/page"));
const TaskDetailPage = lazyPage(() => import("@/app/tasks/[id]/page"));
const TimeLogsPage = lazyPage(() => import("@/app/time-logs/page"));
const UsersPage = lazyPage(() => import("@/app/users/page"));

const routes = [
  { pattern: /^\/$/, component: RootPage },
  { pattern: /^\/login\/?$/, component: LoginPage },
  { pattern: /^\/register\/?$/, component: RegisterPage },
  { pattern: /^\/dashboard\/?$/, component: DashboardPage },
  { pattern: /^\/companies\/?$/, component: CompaniesPage },
  { pattern: /^\/dependencies\/?$/, component: DependenciesPage },
  { pattern: /^\/epics\/?$/, component: EpicsPage },
  { pattern: /^\/gantt\/?$/, component: GanttPage },
  { pattern: /^\/kanban\/?$/, component: KanbanPage },
  { pattern: /^\/metrics\/?$/, component: MetricsPage },
  { pattern: /^\/modules\/?$/, component: ModulesPage },
  { pattern: /^\/my-queue\/?$/, component: MyQueuePage },
  { pattern: /^\/profile\/?$/, component: ProfilePage },
  { pattern: /^\/projects\/?$/, component: ProjectsPage },
  { pattern: /^\/projects\/([^/]+)\/?$/, component: ProjectDetailPage },
  { pattern: /^\/queue\/?$/, component: QueuePage },
  { pattern: /^\/reports\/hours\/?$/, component: HoursReportPage },
  { pattern: /^\/reports\/overview\/?$/, component: OverviewReportPage },
  { pattern: /^\/reports\/productivity\/?$/, component: ProductivityReportPage },
  { pattern: /^\/reports\/projects\/?$/, component: ProjectsReportPage },
  { pattern: /^\/reports\/projects\/([^/]+)\/?$/, component: ProjectReportDetailPage },
  { pattern: /^\/tasks\/?$/, component: TasksPage },
  { pattern: /^\/tasks\/([^/]+)\/?$/, component: TaskDetailPage },
  { pattern: /^\/time-logs\/?$/, component: TimeLogsPage },
  { pattern: /^\/users\/?$/, component: UsersPage },
];

function PageFallback() {
  return <div className="min-h-screen bg-zinc-950" />;
}

function RouteSwitch() {
  const pathname = usePathname();
  const route = routes.find((item) => item.pattern.test(pathname));
  const Page = route?.component ?? DashboardPage;

  return (
    <Suspense fallback={<PageFallback />}>
      <Page />
    </Suspense>
  );
}

export function App() {
  return (
    <RouterProvider>
      <RouteSwitch />
    </RouterProvider>
  );
}
