import { AutoAssignSettings } from './AutoAssignSettings';
import { Rule } from './backup-destination/rule';

export class VirtualMachineBackupPolicy {
  name = '';
  guid;
  priority = 50;
  vms = [];
  autoAssignSettings = new AutoAssignSettings();
  autoRemoveNonPresent = true;
  failRemainingBackupTasksExportThreshold;
  failRemainingBackupTasksStoreThreshold;
  rules = [new Rule()];
  backupRetryCount = 0;
}
