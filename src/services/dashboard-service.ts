import { vprotectApiService } from './vprotect-api-service';
import { ChargebackRequest } from 'model/chargeback/vm-chargeback-request';
import { ExportRequest } from 'model/export-report';
import { userHasPrivilege } from 'utils/privileges';

const uuidRemover = (name: string) => name.replace(/^uuid_[^_]+_/, '');

class DashboardService {
  getChargebackBackupSizeReport(params = {}, data: ChargebackRequest) {
    return vprotectApiService
      .post('/chargeback-reporting/backup-size/vm', data, {
        params: {
          ...params,
        },
      })
      .then((res) =>
        res.map((el) => ({
          ...el,
          name: uuidRemover(el.name),
        })),
      );
  }

  getChargebackTransferSizeReport(params = {}, data: ChargebackRequest) {
    return vprotectApiService
      .post('/chargeback-reporting/transfer-size/vm', data, {
        params: {
          ...params,
        },
      })
      .then((res) =>
        res.map((el) => ({
          ...el,
          name: uuidRemover(el.name),
        })),
      );
  }

  getReport(params = {}) {
    return vprotectApiService.get('/dashboard/report', {
      params: {
        ...params,
        protectedEntityType: 'VM',
      },
    });
  }

  getDashboardVmBackupSizeStats() {
    if (
      !userHasPrivilege([
        'VE_BACKUP_SLA_READ',
        'APP_BACKUP_SLA_READ',
        'STORAGE_BACKUP_SLA_READ',
        'CLOUD_BACKUP_SLA_READ',
      ])
    ) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }

    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 14);
    return vprotectApiService.get('/dashboard/vm-backup-size-stats', {
      from: from.getTime(),
      to: to.getTime(),
    });
  }

  getDashboardInfoPdf(params = {}, exportBody: ExportRequest) {
    const httpOptions = {
      responseType: 'blob',
      observe: 'response',
      params: {
        ...params,
        protectedEntityType: 'VM',
      },
    };
    return vprotectApiService.post(
      '/dashboard/report-pdf',
      exportBody,
      httpOptions,
    );
  }

  getDashboardInfoHtml(params = {}, exportBody: ExportRequest) {
    const httpOptions = {
      responseType: 'blob',
      observe: 'response',
      params: {
        ...params,
        protectedEntityType: 'VM',
      },
    };
    return vprotectApiService.post(
      '/dashboard/report-html',
      exportBody,
      httpOptions,
    );
  }
}

export default new DashboardService();
