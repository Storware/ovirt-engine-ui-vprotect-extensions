import { RootState } from '../index';

export const selectMountableBackups = (store: RootState) =>
  store.mountBackupModal.mountableBackups;
export const selectNodeConfigurations = (store: RootState) =>
  store.mountBackupModal.nodeConfigurations;
export const selectManualMountFilesystems = (store: RootState) =>
  store.mountBackupModal.manualMountFileSystems;
export const selectIscsiMountable = (store: RootState) =>
  store.mountBackupModal.iscsiMountable;
export const selectBackupFiles = (store: RootState) =>
  store.mountBackupModal.backupFiles;
