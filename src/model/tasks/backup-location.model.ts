import { BackupFile } from 'model/backup-file';
import { BackupDestination } from 'model/backup-destination/backup-destination';

export interface BackupLocation {
  guid: string;
  backup: BackupFile;
  snapshotTime: number;
  backupDestination: BackupDestination;
}
