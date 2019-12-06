import { pluginBasePath, vprotectVirtualMachineListPlaceToken, vprotectTaskConsolePlaceToken, primaryMenuId } from '../constants'
import getPluginApi from '../plugin-api'
import { msg } from '../intl-messages'

function addVprotectPlace () {
  getPluginApi().addPrimaryMenuContainer(msg.vprotectTitle(), primaryMenuId, {
    priority: 10,
    icon: 'fa-font'
  })

  getPluginApi().addSecondaryMenuPlace(primaryMenuId, msg.vprotectVirtualMachinesTitle(), vprotectVirtualMachineListPlaceToken, `${pluginBasePath}/virtual-machine-list.html`, {
    priority: 10
  })

  getPluginApi().addSecondaryMenuPlace(primaryMenuId, msg.vprotectTaskConsoleTitle(), vprotectTaskConsolePlaceToken, `${pluginBasePath}/task-console.html`, {
    priority: 11
  })
}

export function addPlaces () {
  addVprotectPlace()
}
