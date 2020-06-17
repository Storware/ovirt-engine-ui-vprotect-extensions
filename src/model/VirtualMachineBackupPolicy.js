import { AutoAssignSettings } from './AutoAssignSettings';

export class VirtualMachineBackupPolicy {
  name = '';
  guid;
  priority = 50;
  vms = [];
  autoAssignSettings = new AutoAssignSettings();
  autoRemoveNonPresent = true;
  failRemainingBackupTasksExportThreshold;
  failRemainingBackupTasksStoreThreshold;
  rules = [
    {
      name: 'Default',
      schedules: [],
      backupDestinations: [],
    },
  ];
}
