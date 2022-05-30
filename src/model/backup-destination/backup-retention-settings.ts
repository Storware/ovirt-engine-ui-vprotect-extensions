import {BackupSimpleRetentionSettings} from './backup-simple-retention-settings';

export class BackupRetentionSettings extends BackupSimpleRetentionSettings {
  retentionKeepLastNIncremental = 30;
  retentionKeepIncrementalNewerThan = 30 * 1000 * 60 * 60 * 24;
}
