import { pluginName } from 'utils/constants';
import { getWebAdminWindow } from 'utils/webadmin-dom';

let api;

function getPluginApi() {
  api = api || getWebAdminWindow().pluginApi(pluginName);
  return api;
}

export default getPluginApi;
