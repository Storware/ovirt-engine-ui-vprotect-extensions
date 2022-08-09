import { Schedule } from '../schedule';
import { BackupDestinationRule } from './backup-destination-rule';

export class Rule {
  active = true;
  guid: string;
  schedules: Schedule[] = [];
  backupDestinations = [];
  ruleBackupDestinations = [
    {
      primaryBackupDestination: new BackupDestinationRule('PRIMARY'),
      secondaryBackupDestination: new BackupDestinationRule('SECONDARY'),
    },
  ];
  retentionVersions: number;
  retentionDays: number;
  position = 0;

  // UI flag
  isNotSaved = true;

  constructor(public name = 'Default') {}
}
