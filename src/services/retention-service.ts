import { BackupLocation } from 'model/tasks/backup-location.model';
import { vprotectApiService } from './vprotect-api-service';

export class RetentionService {
  previewMarkBackups(backupLocations: BackupLocation[]) {
    return vprotectApiService.post(
      '/retention/mark-backups/preview',
      backupLocations,
    );
  }

  markBackups(backupLocations: BackupLocation[]) {
    return vprotectApiService.post('/retention/mark-backups', backupLocations);
  }
}

export const retentionService = new RetentionService();
