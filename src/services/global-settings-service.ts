import { vprotectApiService } from './vprotect-api-service';
import { ExportRequest } from 'model/export-report';

class GlobalSettingsService {
  getGlobalSettings() {
    return vprotectApiService.get('/global-settings');
  }

  sendDashboardInfoEmail(params = {}, exportBody: ExportRequest) {
    const httpOptions = {
      params: {
        ...params,
        protectedEntityType: 'VM',
      },
    };
    return vprotectApiService.post(
      '/dashboard/report-email',
      exportBody,
      httpOptions,
    );
  }
}

export default new GlobalSettingsService();
