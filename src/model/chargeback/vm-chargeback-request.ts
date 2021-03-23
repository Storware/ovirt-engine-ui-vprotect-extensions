export class ChargebackRequest {
  groupBy = 'backup-destination';
  backupDestinationGuids: string[] = [];
  backupPolicyGuids: string[] = [];
  hypervisorClusterGuids: string[] = [];
  hypervisorManagerGuids: string[] = [];
  hypervisorGuids: string[] = [];
  virtualMachineGuids: string[] = [];
  projectGuids: string[] = [];
}
