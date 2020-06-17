import { vprotectService } from 'services/vprotect-service';
import getPluginApi from 'integrations/plugin-api';

const username = getPluginApi().configObject().username;
const password = getPluginApi().configObject().password;

class AppInit {
  run = async () => {
    const user = await vprotectService.login(username, password);
    localStorage.setItem('user', JSON.stringify(user));
  };
}

export default new AppInit();
