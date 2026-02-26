import { PATHS } from '@/const/paths';
import {
  Dashboard,
  MountedBackups,
  PoliciesAndSchedules,
  Reporting,
  Settings,
  TaskConsole,
  VirtualMachines,
  WorkflowExecution,
} from '@/pages';

export default [
  { path: PATHS.DASHBOARD, component: Dashboard },
  { path: PATHS.VIRTUAL_ENVIRONMENTS, component: VirtualMachines },
  { path: PATHS.TASK_CONSOLE, component: TaskConsole },
  { path: PATHS.WORKFLOW_EXECUTION, component: WorkflowExecution },
  { path: PATHS.POLICIES_AND_SHEDULES, component: PoliciesAndSchedules },
  { path: PATHS.MOUNTED_BACKUPS, component: MountedBackups },
  { path: PATHS.REPORTING, component: Reporting },
  { path: PATHS.SETTINGS, component: Settings },
];
