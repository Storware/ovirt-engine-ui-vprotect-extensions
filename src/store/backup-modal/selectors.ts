import {RootState} from '../index';

export const selectBackupDestinations = (store: RootState) => store.backupModal.backupDestinations;
export const selectBackupTypes = (store: RootState) => store.backupModal.backupTypes;
