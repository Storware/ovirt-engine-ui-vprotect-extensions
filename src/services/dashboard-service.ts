import { vprotectApiService } from './vprotect-api-service';

class DashboardService {
  getChargeBackReport() {
    return vprotectApiService.post(`/chargeback-reporting/backup-size/vm`, {
      groupBy: 'virtual-machine',
      // ...(config.build === 'OPENSTACK' && { projectGuids: [getCookie('project')] }),
    });
  }

  getReport(params = {}) {
    return vprotectApiService.get(`/dashboard/report`, {
      params: {
        ...params,
        protectedEntityType: 'VM',
      },
    });
  }
}

export default new DashboardService();
