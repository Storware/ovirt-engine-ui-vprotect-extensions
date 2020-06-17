import {
  pluginBasePath,
  vprotectVirtualMachineListPlaceToken,
  vprotectTaskConsolePlaceToken,
  primaryMenuId,
  vprotectDashboardPlaceToken,
  vprotectPoliciesToken,
  vprotectSchedulesToken,
  vprotectMountedBackupsToken,
} from 'utils/constants';
import getPluginApi from 'integrations/plugin-api';

function addVprotectPlace() {
  getPluginApi().addPrimaryMenuContainer('VM Backup', primaryMenuId, {
    priority: 10,
    icon: 'fa-font',
  });

  getPluginApi().addSecondaryMenuPlace(
    primaryMenuId,
    'Dashboard',
    vprotectDashboardPlaceToken,
    `${pluginBasePath}/index.html;dashboard`,
    {
      priority: 9,
    },
  );

  getPluginApi().addSecondaryMenuPlace(
    primaryMenuId,
    'Virtual Machines',
    vprotectVirtualMachineListPlaceToken,
    `${pluginBasePath}/index.html;virtual-machines`,
    {
      priority: 10,
    },
  );

  getPluginApi().addSecondaryMenuPlace(
    primaryMenuId,
    'Task Console',
    vprotectTaskConsolePlaceToken,
    `${pluginBasePath}/index.html;task-console`,
    {
      priority: 11,
    },
  );

  getPluginApi().addSecondaryMenuPlace(
    primaryMenuId,
    'Policies',
    vprotectPoliciesToken,
    `${pluginBasePath}/index.html;policies/list/vm-backup`,
    {
      priority: 12,
    },
  );

  getPluginApi().addSecondaryMenuPlace(
    primaryMenuId,
    'Schedules',
    vprotectSchedulesToken,
    `${pluginBasePath}/index.html;schedules/list/VM_BACKUP`,
    {
      priority: 13,
    },
  );

  getPluginApi().addSecondaryMenuPlace(
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
