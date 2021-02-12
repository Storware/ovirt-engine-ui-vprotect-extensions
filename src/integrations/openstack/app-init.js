import { vprotectService } from 'services/vprotect-service';

class AppInit {
  run = async () => {
    const user = await vprotectService.userInfo();
    localStorage.setItem('user', JSON.stringify(user));
  };
}

export default new AppInit();
