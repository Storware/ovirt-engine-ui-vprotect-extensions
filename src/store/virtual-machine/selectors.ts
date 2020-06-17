import { RootState } from '../index';

export const selectVirtualMachine = (store: RootState) =>
  store.virtualMachine.virtualMachine;
export const selectHypervisor = (store: RootState) =>
  store.virtualMachine.hypervisor;
export const selectBackupsHistory = (store: RootState) =>
  store.virtualMachine.backupsHistory;
export const selectRestoresHistory = (store: RootState) =>
  store.virtualMachine.restoresHistory;
export const selectSnapshots = (store: RootState) =>
  store.virtualMachine.snapshots;
export const selectDisks = (store: RootState) => store.virtualMachine.disks;
export const selectSchedules = (store: RootState) =>
  store.virtualMachine.schedules;
export const selectPolicies = (store: RootState) =>
  store.virtualMachine.policies;
export const selectSnapshotPolicies = (store: RootState) =>
  store.virtualMachine.snapshotPolicies;
