import RootPage from "@/app/page";
import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import DashboardPage from "@/app/dashboard/page";
import CompaniesPage from "@/app/companies/page";
import DependenciesPage from "@/app/dependencies/page";
import EpicsPage from "@/app/epics/page";
import GanttPage from "@/app/gantt/page";
import KanbanPage from "@/app/kanban/page";
import MetricsPage from "@/app/metrics/page";
import ModulesPage from "@/app/modules/page";
import MyQueuePage from "@/app/my-queue/page";
import ProfilePage from "@/app/profile/page";
import ProjectsPage from "@/app/projects/page";
import ProjectDetailPage from "@/app/projects/[id]/page";
import QueuePage from "@/app/queue/page";
import HoursReportPage from "@/app/reports/hours/page";
import OverviewReportPage from "@/app/reports/overview/page";
import ProductivityReportPage from "@/app/reports/productivity/page";
import ProjectsReportPage from "@/app/reports/projects/page";
import ProjectReportDetailPage from "@/app/reports/projects/[id]/page";
import TasksPage from "@/app/tasks/page";
import TaskDetailPage from "@/app/tasks/[id]/page";
import TimeLogsPage from "@/app/time-logs/page";
import UsersPage from "@/app/users/page";
import { RouterProvider, usePathname } from "@/lib/router";

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

function RouteSwitch() {
  const pathname = usePathname();
  const route = routes.find((item) => item.pattern.test(pathname));
  const Page = route?.component ?? DashboardPage;

  return <Page />;
}

export function App() {
  return (
    <RouterProvider>
      <RouteSwitch />
    </RouterProvider>
  );
}
