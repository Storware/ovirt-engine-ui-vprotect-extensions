import { pluginBasePath, vprotectPlaceToken } from '../constants'
import getPluginApi from '../plugin-api'
import { msg } from '../intl-messages'

function addVprotectPlace () {
  getPluginApi().addPrimaryMenuPlace(msg.vprotectTitle(), vprotectPlaceToken, `${pluginBasePath}/vprotect.html`, {
    // place the menu item before existing ones
    priority: 10,
    // customize the prefix displayed in search bar
    searchPrefix: 'vProtect',
    // make users land on this place by default
    defaultPlace: false,
    // make sure the menu item has the right icon
    icon: 'fa-font'
  })
}

export function addPlaces () {
  addVprotectPlace()
}
