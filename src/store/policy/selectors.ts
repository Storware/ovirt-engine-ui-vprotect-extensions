import { RootState } from '../index';

export const selectPolicy = (store: RootState) => store.policy.policy;
export const selectHypervisorClusters = (store: RootState) =>
  store.policy.hypervisorClusters;
export const selectVirtualMachines = (store: RootState) =>
  store.policy.virtualMachines;
export const selectBackupDestinations = (store: RootState) =>
  store.policy.backupDestinations;
export const selectSchedules = (store: RootState) => store.policy.schedules;
