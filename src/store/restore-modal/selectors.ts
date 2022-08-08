import { RootState } from '../index';

export const selectTask = (store: RootState) => store.restoreModal.task;
export const selectBackupLocations = (store: RootState) =>
  store.restoreModal.backupLocations;
export const selectBackupFiles = (store: RootState) =>
  store.restoreModal.backupFiles;
export const selectHypervisorManagers = (store: RootState) =>
  store.restoreModal.hypervisorManagers;
export const selectHypervisorStorages = (store: RootState) =>
  store.restoreModal.hypervisorStorages;
export const selectFilteredHypervisorStorages = (store: RootState) =>
  store.restoreModal.filteredHypervisorStorages;
export const selectFlavors = (store: RootState) =>
  store.restoreModal.flavors;
export const selectHypervisorClusters = (store: RootState) =>
  store.restoreModal.hypervisorClusters;
