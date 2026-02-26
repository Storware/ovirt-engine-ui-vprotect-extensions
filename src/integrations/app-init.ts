import { vprotectService } from 'services/vprotect-service';
import getPluginApi from 'integrations/plugin-api';

class AppInit {
  run = async () => {
    const config = getPluginApi.configObject();
    const user = await vprotectService.login(config.username, config.password);
    localStorage.setItem('user', JSON.stringify(user));
  };
}

export default new AppInit();
