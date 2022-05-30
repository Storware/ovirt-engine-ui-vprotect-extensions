import {BackupRetentionSettings} from './backup-retention-settings';
import {BackupDestinationType} from './backup-destination-type';

export const BackupDestinationRetentionFactory: Record<BackupDestinationType, any> = {
  FILESYSTEM: BackupRetentionSettings,
  SYNTHETICXFS: BackupRetentionSettings,
  SYNTHETICDDBOOST: BackupRetentionSettings,
  VSTOR: BackupRetentionSettings,
  ISP: BackupRetentionSettings,
  NETBACKUP: null,
  NETWORKER: BackupRetentionSettings,
  AZURE: BackupRetentionSettings,
  S3: BackupRetentionSettings,
  SWIFT: BackupRetentionSettings,
  GCS: BackupRetentionSettings,
  AVAMAR: BackupRetentionSettings,
  DATAPROTECTOR: BackupRetentionSettings,
};
