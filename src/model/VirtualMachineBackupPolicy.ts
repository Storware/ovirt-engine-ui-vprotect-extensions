import { AutoAssignSettings } from './AutoAssignSettings';
import { Rule } from './backup-destination/rule';
import { NameAndGuid } from './dto/nameAndGuid';

export class VirtualMachineBackupPolicy {
  vms = [];
  autoAssignSettings = new AutoAssignSettings();
  autoRemoveNonPresent = true;
  dailyReportEnabled: boolean;
  mailingList: NameAndGuid;
  failRemainingBackupTasksExportThreshold: number;
  failRemainingBackupTasksStoreThreshold: number;
  active = true;
  backupRetryCount = 0;
  name: string;
  guid: string;
  priority = 50;
  rules = [new Rule()];
  executeAutoAssignmentAfterSavingPolicy = true;
}
