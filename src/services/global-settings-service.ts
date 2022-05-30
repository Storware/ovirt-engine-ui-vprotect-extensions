import { vprotectApiService } from './vprotect-api-service';
import { StringDTO } from 'model/dto/string';

class GlobalSettingsService {
  getGlobalSettings() {
    return vprotectApiService.get('/global-settings');
  }

  sendDashboardInfoEmail(emails: StringDTO, params = {}) {
    const httpOptions = {
      params: {
        ...params,
        protectedEntityType: 'VM',
      },
    };
    return vprotectApiService.post(
      '/dashboard/report-email',
      emails,
      httpOptions,
    );
  }
}

export default new GlobalSettingsService();
