import { vprotectApiService } from './vprotect-api-service';
import { ChargebackRequest } from 'model/chargeback/vm-chargeback-request';

class DashboardService {
  getChargebackReport(data: ChargebackRequest) {
    return vprotectApiService.post(
      `/chargeback-reporting/backup-size/vm`,
      data,
    );
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
