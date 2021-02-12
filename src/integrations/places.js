import {
  pluginBasePath,
  vprotectVirtualMachineListPlaceToken,
  vprotectTaskConsolePlaceToken,
  primaryMenuId,
  vprotectDashboardPlaceToken,
  vprotectMountedBackupsToken,
} from 'utils/constants';
import getPluginApi from 'integrations/plugin-api';

function addVprotectPlace() {
  getPluginApi.addPrimaryMenuContainer('VM Backup', primaryMenuId, {
    priority: 10,
    icon: 'fa-font',
  });

  getPluginApi.addSecondaryMenuPlace(
    primaryMenuId,
    'Dashboard',
    vprotectDashboardPlaceToken,
    `${pluginBasePath}/index.html;dashboard`,
    {
      priority: 9,
    },
  );

  getPluginApi.addSecondaryMenuPlace(
    primaryMenuId,
    'Virtual Machines',
    vprotectVirtualMachineListPlaceToken,
    `${pluginBasePath}/index.html;virtual-machines`,
    {
      priority: 10,
    },
  );

  getPluginApi.addSecondaryMenuPlace(
    primaryMenuId,
    'Task Console',
    vprotectTaskConsolePlaceToken,
    `${pluginBasePath}/index.html;task-console`,
    {
      priority: 11,
    },
  );

  getPluginApi.addSecondaryMenuPlace(
    primaryMenuId,
    'Backup SLAs',
    'vprotect-policies-and-schedules',
    `${pluginBasePath}/index.html;policies-and-schedules`,
    {
      priority: 12,
    },
  );

  getPluginApi.addSecondaryMenuPlace(
    primaryMenuId,
    'Mounted Backups',
    vprotectMountedBackupsToken,
    `${pluginBasePath}/index.html;mounted-backups`,
    {
      priority: 14,
    },
  );
}

export function addPlaces() {
  addVprotectPlace();
}
