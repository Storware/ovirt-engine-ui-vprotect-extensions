import {RootState} from '../index';

export const selectTask = (store: RootState) => store.mountBackupModal.task;
export const selectMountableBackups = (store: RootState) => store.mountBackupModal.mountableBackups;
export const selectNodes = (store: RootState) => store.mountBackupModal.nodes;
