export class FilterState {
  backupDestinationGuids: string[] = [];
  backupPolicyGuids: string[] = [];
  groupBy = 'backup-destination';
  hypervisorClusterGuids: string[] = [];
  hypervisorGuids: string[] = [];
  hypervisorManagerGuids: string[] = [];
  projectGuids: string[] = [];
  virtualMachineGuids: string[] = [];
}
