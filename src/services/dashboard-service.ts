import { vprotectApiService } from './vprotect-api-service';
import { ChargebackRequest } from 'model/chargeback/vm-chargeback-request';

function getPositionOfChar(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

const deleteUuidFromName = (name) => {
  if (!name.startsWith('uuid')) {
    return name;
  } else {
    return name.substring(getPositionOfChar(name, '_', 2) + 1);
  }
};

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
          name: deleteUuidFromName(el.name),
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
          name: deleteUuidFromName(el.name),
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
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 14);
    return vprotectApiService.get('/dashboard/vm-backup-size-stats', {
      from: from.getTime(),
      to: to.getTime(),
    });
  }

  getDashboardInfoPdf(params = {}) {
    return vprotectApiService.get('/dashboard/report-pdf', {
      responseType: 'blob',
      observe: 'response',
      params: { ...params, protectedEntityType: 'VM' },
    });
  }

  getDashboardInfoHtml(params = {}) {
    return vprotectApiService.get('/dashboard/report-html', {
      responseType: 'blob',
      observe: 'response',
      params: { ...params, protectedEntityType: 'VM' },
    });
  }
}

export default new DashboardService();
