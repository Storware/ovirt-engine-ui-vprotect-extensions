import {
  pluginBasePath,
  vprotectVirtualMachineListPlaceToken,
  vprotectTaskConsolePlaceToken,
  primaryMenuId,
  vprotectDashboardPlaceToken,
  vprotectPoliciesToken,
  vprotectSchedulesToken,
  vprotectMountedBackupsToken
} from '../constants'
import getPluginApi from '../plugin-api'
import { msg } from '../intl-messages'

function addVprotectPlace () {
  getPluginApi().addPrimaryMenuContainer(msg.vprotectTitle(), primaryMenuId, {
    priority: 10,
    icon: 'fa-font'
  })

  getPluginApi().addSecondaryMenuPlace(primaryMenuId, msg.vprotectDashboardTitle(), vprotectDashboardPlaceToken, `${pluginBasePath}/index.html;dashboard`, {
    priority: 9
  })

  getPluginApi().addSecondaryMenuPlace(primaryMenuId, msg.vprotectVirtualMachinesTitle(), vprotectVirtualMachineListPlaceToken, `${pluginBasePath}/index.html;virtual-machines`, {
    priority: 10
  })

  getPluginApi().addSecondaryMenuPlace(primaryMenuId, msg.vprotectTaskConsoleTitle(), vprotectTaskConsolePlaceToken, `${pluginBasePath}/index.html;task-console`, {
    priority: 11
  })

  getPluginApi().addSecondaryMenuPlace(primaryMenuId, msg.vprotectPolicies(), vprotectPoliciesToken, `${pluginBasePath}/index.html;policies`, {
    priority: 12
  })

  getPluginApi().addSecondaryMenuPlace(primaryMenuId, msg.vprotectSchedules(), vprotectSchedulesToken, `${pluginBasePath}/index.html;schedules`, {
    priority: 13
  })

  getPluginApi().addSecondaryMenuPlace(primaryMenuId, msg.vprotectMountedBackups(), vprotectMountedBackupsToken, `${pluginBasePath}/index.html;mounted-backups`, {
    priority: 14
  })
}

export function addPlaces () {
  addVprotectPlace()
}
