import { pluginName } from 'utils/constants';
import { getWebAdminWindow } from 'utils/webadmin-dom';

const getPluginApi = getWebAdminWindow().pluginApi(pluginName);

export default getPluginApi;
