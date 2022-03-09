import { Dashboard } from 'pages/dashboard/Dashboard';
import MountedBackups from 'pages/mounted-backups/MountedBackups';
import VirtualMachines from 'pages/virtual-machines/VirtualMachines';
import PoliciesAndSchedules from 'pages/policies-and-schedules/PoliciesAndSchedules';
import Reporting from 'pages/reporting/Reporting';
import TaskConsole from 'pages/task-console/TaskConsole';
import Settings from 'pages/settings/Settings';
import Credentials from 'pages/os-credensial/Credentials';

export default [
  { path: '/dashboard', component: Dashboard },
  { path: '/virtual_environments', component: VirtualMachines },
  { path: '/task_console', component: TaskConsole },
  { path: '/policies_and_schedules', component: PoliciesAndSchedules },
  { path: '/mounted_backups', component: MountedBackups },
  { path: '/reporting', component: Reporting },
  { path: '/settings', component: Settings },
  { path: '/os-credentials', component: Credentials },
];
