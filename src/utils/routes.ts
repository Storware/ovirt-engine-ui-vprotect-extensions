import { Dashboard } from 'pages/dashboard/Dashboard';
import { TaskConsole } from 'pages/task-console/TaskConsole';
import MountedBackups from 'pages/mounted-backups/MountedBackups';
import VirtualMachines from 'pages/virtual-machines/VirtualMachines';
import PoliciesAndSchedules from 'pages/policies-and-schedules/PoliciesAndSchedules';

export default [
  { path: '/dashboard', component: Dashboard },
  { path: '/virtual_environments', component: VirtualMachines },
  { path: '/task_console', component: TaskConsole },
  { path: '/policies_and_schedules', component: PoliciesAndSchedules },
  { path: '/mounted_backups', component: MountedBackups },
];
