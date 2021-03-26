import { pluginBasePath, primaryMenuId } from 'utils/constants';
import getPluginApi from 'integrations/plugin-api';

function addVprotectPlace() {
  getPluginApi.addPrimaryMenuContainer('VM Backup', primaryMenuId, {
    priority: 10,
    icon: 'fa-font',
  });

  getPluginApi.addSecondaryMenuPlace(
    primaryMenuId,
    'Dashboard',
    'vprotect-dashboard',
    `${pluginBasePath}/index.html;dashboard`,
    {
      priority: 9,
    },
  );

  getPluginApi.addSecondaryMenuPlace(
    primaryMenuId,
    'Virtual Environments',
    'vprotect-virtual-machine-list',
    `${pluginBasePath}/index.html;virtual_environments`,
    {
      priority: 10,
    },
  );

  getPluginApi.addSecondaryMenuPlace(
    primaryMenuId,
    'Reporting',
    'vprotect-reporting',
    `${pluginBasePath}/index.html;reporting`,
    {
      priority: 11,
    },
  );

  getPluginApi.addSecondaryMenuPlace(
    primaryMenuId,
    'Task Console',
    'vprotect-task-console-list',
    `${pluginBasePath}/index.html;task_console`,
    {
      priority: 12,
    },
  );

  getPluginApi.addSecondaryMenuPlace(
    primaryMenuId,
    'Backup SLAs',
    'vprotect-policies-and-schedules-backup',
    `${pluginBasePath}/index.html;policies_and_schedules`,
    {
      priority: 13,
    },
  );

  getPluginApi.addSecondaryMenuPlace(
    primaryMenuId,
    'Snapshot SLAs',
    'vprotect-policies-and-schedules-snapshot',
    `${pluginBasePath}/index.html;policies_and_schedules/snapshot`,
    {
      priority: 14,
    },
  );

  getPluginApi.addSecondaryMenuPlace(
    primaryMenuId,
    'Mounted Backups',
    'vprotect-mounted-backups',
    `${pluginBasePath}/index.html;mounted_backups`,
    {
      priority: 15,
    },
  );
}

export function addPlaces() {
  addVprotectPlace();
}
