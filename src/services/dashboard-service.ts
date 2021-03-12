import { vprotectApiService } from './vprotect-api-service';
import config from 'utils/config';
import getCookie from 'utils/getCookie';

class DashboardService {
  getChargeBackReport() {
    return vprotectApiService.post(`/chargeback-reporting/backup-size/vm`, {
      groupBy: 'virtual-machine',
      // ...(config.build === 'OPENSTACK' && { projectGuids: [getCookie('project')] }),
    });
  }
}

export default new DashboardService();
