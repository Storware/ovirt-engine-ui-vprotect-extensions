import { RootState } from '../index';

export const selectTask = (store: RootState) => store.restoreModal.task;
export const selectBackups = (store: RootState) => store.restoreModal.backups;
export const selectHypervisorManagers = (store: RootState) =>
  store.restoreModal.hypervisorManagers;
export const selectHypervisorStorages = (store: RootState) =>
  store.restoreModal.hypervisorStorages;
export const selectFilteredHypervisorStorages = (store: RootState) =>
  store.restoreModal.filteredHypervisorStorages;
export const selectHypervisorClusters = (store: RootState) =>
  store.restoreModal.hypervisorClusters;
