import {
  Credentials,
  Dashboard,
  MountedBackups,
  PoliciesAndSchedules,
  Reporting,
  Settings,
  TaskConsole,
  VirtualMachines,
  WorkflowExecution,
} from 'pages';

export default [
  { path: '/dashboard', component: Dashboard },
  { path: '/virtual_environments', component: VirtualMachines },
  { path: '/task_console', component: TaskConsole },
  { path: '/workflow_execution', component: WorkflowExecution },
  { path: '/policies_and_schedules', component: PoliciesAndSchedules },
  { path: '/mounted_backups', component: MountedBackups },
  { path: '/reporting', component: Reporting },
  { path: '/settings', component: Settings },
  { path: '/os-credentials', component: Credentials },
];
