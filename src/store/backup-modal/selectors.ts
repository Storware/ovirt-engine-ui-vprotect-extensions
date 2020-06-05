import {RootState} from '../index';

export const selectTask = (store: RootState) => store.backupModal.task;
export const selectBackupDestinations = (store: RootState) => store.backupModal.backupDestinations;
export const selectBackupTypes = (store: RootState) => store.backupModal.backupTypes;
