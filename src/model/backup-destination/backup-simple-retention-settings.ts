import {KeepLastBackupWhenSourceStillExists} from './keep-last-backup-when-source-still-exists';

export class BackupSimpleRetentionSettings extends KeepLastBackupWhenSourceStillExists {
  retentionKeepLastNFull = 4;
  retentionKeepFullNewerThan = 30 * 1000 * 60 * 60 * 24;
}
