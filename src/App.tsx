import { lazy, Suspense, type ComponentType } from "react";
import { RouterProvider, usePathname } from "@/lib/router";
import { AppLayout } from "@/components/layout/app-layout";
import { pageLoaders } from "@/lib/page-loaders";

function lazyPage<T extends ComponentType<unknown>>(
  loader: () => Promise<{ default: T }>,
) {
  return lazy(loader);
}

const RootPage = lazyPage(pageLoaders.root);
const LoginPage = lazyPage(pageLoaders.login);
const RegisterPage = lazyPage(pageLoaders.register);
const DashboardPage = lazyPage(pageLoaders.dashboard);
const CompaniesPage = lazyPage(pageLoaders.companies);
const DependenciesPage = lazyPage(pageLoaders.dependencies);
const EpicsPage = lazyPage(pageLoaders.epics);
const GanttPage = lazyPage(pageLoaders.gantt);
const KanbanPage = lazyPage(pageLoaders.kanban);
const MetricsPage = lazyPage(pageLoaders.metrics);
const ModulesPage = lazyPage(pageLoaders.modules);
const MyQueuePage = lazyPage(pageLoaders.myQueue);
const ProfilePage = lazyPage(pageLoaders.profile);
const ProjectsPage = lazyPage(pageLoaders.projects);
const ProjectDetailPage = lazyPage(pageLoaders.projectDetail);
const QueuePage = lazyPage(pageLoaders.queue);
const HoursReportPage = lazyPage(pageLoaders.hoursReport);
const OverviewReportPage = lazyPage(pageLoaders.overviewReport);
const ProductivityReportPage = lazyPage(pageLoaders.productivityReport);
const ProjectsReportPage = lazyPage(pageLoaders.projectsReport);
const ProjectReportDetailPage = lazyPage(pageLoaders.projectReportDetail);
const TasksPage = lazyPage(pageLoaders.tasks);
const TaskDetailPage = lazyPage(pageLoaders.taskDetail);
const TimeLogsPage = lazyPage(pageLoaders.timeLogs);
const UsersPage = lazyPage(pageLoaders.users);

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

const PUBLIC_ROUTE_PATTERN = /^\/(login|register)\/?$/;

function PageFallback() {
  return <div className="min-h-screen bg-zinc-950" />;
}

function MainContentFallback() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-950">
      <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function RouteSwitch() {
  const pathname = usePathname();
  const route = routes.find((item) => item.pattern.test(pathname));
  const Page = route?.component ?? DashboardPage;
  const isPublicRoute = PUBLIC_ROUTE_PATTERN.test(pathname);

  const page = (
    <Suspense fallback={isPublicRoute ? <PageFallback /> : <MainContentFallback />}>
      <Page />
    </Suspense>
  );

  if (isPublicRoute) return page;

  return <AppLayout>{page}</AppLayout>;
}

export function App() {
  return (
    <RouterProvider>
      <RouteSwitch />
    </RouterProvider>
  );
}
