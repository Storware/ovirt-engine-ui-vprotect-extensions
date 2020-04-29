import getPluginApi from '../plugin-api'
import {webadminToastTypes} from '../constants'

class AlertService {
  error (text) {
    getPluginApi().showToast(webadminToastTypes.danger, text)
  }

  info (text) {
    getPluginApi().showToast(webadminToastTypes.info, text)
  }
}

export const alertService = new AlertService()
