import getPluginApi from 'integrations/plugin-api';
import { webadminToastTypes } from 'utils/constants';

class AlertService {
  error(text) {
    getPluginApi.showToast(webadminToastTypes.danger, text);
  }

  info(text) {
    getPluginApi.showToast(webadminToastTypes.info, text);
  }
}

export const alertService = new AlertService();
