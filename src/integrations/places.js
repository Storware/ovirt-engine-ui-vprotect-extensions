import { pluginBasePath,
  vprotectVirtualMachineListPlaceToken,
  vprotectTaskConsolePlaceToken,
  primaryMenuId,
  vprotectDashboardPlaceToken,
  vprotectPoliciesToken
} from '../constants'
import getPluginApi from '../plugin-api'
import { msg } from '../intl-messages'

function addVprotectPlace () {
  getPluginApi().addPrimaryMenuContainer(msg.vprotectTitle(), primaryMenuId, {
    priority: 10,
    icon: 'fa-font'
  })

  getPluginApi().addSecondaryMenuPlace(primaryMenuId, msg.vprotectDashboardTitle(), vprotectDashboardPlaceToken, `${pluginBasePath}/template.html;dashboard`, {
    priority: 9
  })

  getPluginApi().addSecondaryMenuPlace(primaryMenuId, msg.vprotectVirtualMachinesTitle(), vprotectVirtualMachineListPlaceToken, `${pluginBasePath}/template.html;virtual-machine-list`, {
    priority: 10
  })

  getPluginApi().addSecondaryMenuPlace(primaryMenuId, msg.vprotectTaskConsoleTitle(), vprotectTaskConsolePlaceToken, `${pluginBasePath}/template.html;task-console`, {
    priority: 11
  })

  getPluginApi().addSecondaryMenuPlace(primaryMenuId, msg.vprotectPolicies(), vprotectPoliciesToken, `${pluginBasePath}/template.html;policies`, {
    priority: 12
  })
}

export function addPlaces () {
  addVprotectPlace()
}
