import { NameAndDescription } from '../dto/nameAndDescription';
import { NameAndGuid } from '../dto/nameAndGuid';
import { BackupDestination } from './backup-destination';
import { BackupDestinationRuleType } from './backup-destination-rule-type';
import { BackupRetentionSettings } from './backup-retention-settings';

export class BackupDestinationRule {
  active: false;
  roleType: NameAndDescription<BackupDestinationRuleType>;
  backupDestination: NameAndGuid = new BackupDestination();
  backupRetentionSettings: BackupRetentionSettings =
    new BackupRetentionSettings();
  daysToKeepRetentionLock: number = 0;

  constructor(roleType: BackupDestinationRuleType) {
    this.roleType = { name: roleType, description: roleType };
  }
}
