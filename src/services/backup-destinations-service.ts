import { vprotectApiService } from './vprotect-api-service';
import { TableParams } from '../components/table/primereactTable/TableParams';

class BackupDestinationsService {
  // backupDestinationTypes = [
  //   {name: 'FILESYSTEM', description: 'fs', type: 'standalone'},
  //   {name: 'VSNAP', description: 'catalogicVstorServer', type: 'standalone'},
  //   {name: 'ISP', description: 'ibmSpectrumProtect', type: 'proxy'},
  //   {name: 'NETBACKUP', description: 'veritasNetBackup', type: 'proxy'},
  //   {name: 'AVAMAR', description: 'avamar', type: 'proxy'},
  //   {name: 'NETWORKER', description: 'dellEmcNetWorker', type: 'proxy'},
  //   {name: 'S3', description: 'amazonS3', type: 'standalone'},
  //   {name: 'GCS', description: 'googleCloudStorage', type: 'standalone'},
  //   {name: 'AZURE', description: 'microsoftAzure', type: 'standalone'},
  //   {name: 'SWIFT', description: 'openStackSwift', type: 'standalone'}
  // ];

  getBackupDestinationsForVMs(vms) {
    return vprotectApiService.post('/backup-destinations/usable-for-vms', vms);
  }

  getAllBackupDestinations() {
    return vprotectApiService.get('/backup-destinations');
  }

  getBackupDestinationsPage(params: TableParams) {
    return vprotectApiService.get(`/backup-destinations`, {
      params,
      paginate: true,
    });
  }
}

export const backupDestinationsService = new BackupDestinationsService();
