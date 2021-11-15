import { NameAndGuid } from '../dto/nameAndGuid';
import { AutoAssignSettings } from '../auto-assign-settings';

export class PolicySnapshot {
  name: string;
  priority = 50;
  guid: string;
  vms: NameAndGuid[] = [];
  rules: [
    {
      name: 'Default';
      retentionVersions: number;
      schedules: NameAndGuid[];
      retentionDays: number;
    },
  ];
  autoAssignSettings = new AutoAssignSettings();
  autoRemoveNonPresent = true;
  backupRetryCount = 0;
}
