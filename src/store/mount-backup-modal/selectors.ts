import { RootState } from '../index';

export const selectMountableBackups = (store: RootState) =>
  store.mountBackupModal.mountableBackups;
export const selectNodes = (store: RootState) => store.mountBackupModal.nodes;
export const selectManualMountFilesystems = (store: RootState) =>
  store.mountBackupModal.manualMountFileSystems;
export const selectIscsiMountable = (store: RootState) =>
  store.mountBackupModal.iscsiMountable;
export const selectBackupFiles = (store: RootState) =>
  store.mountBackupModal.backupFiles;
export const selectTask = (store: RootState) => store.mountBackupModal.task;
