import {NameAndDescription} from '../dto/nameAndDescription';
import {NameAndGuid} from '../dto/nameAndGuid';
import {BackupDestination} from './backup-destination';
import {BackupDestinationRuleType} from './backup-destination-rule-type';
import {BackupRetentionSettings} from './backup-retention-settings';

export class BackupDestinationRule {
  roleType: NameAndDescription<BackupDestinationRuleType>;
  backupDestination: NameAndGuid = new BackupDestination();
  backupRetentionSettings: BackupRetentionSettings = new BackupRetentionSettings();

  constructor(roleType: BackupDestinationRuleType) {
    this.roleType = { name: roleType, description: roleType };
  }
}
