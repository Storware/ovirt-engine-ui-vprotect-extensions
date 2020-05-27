import {RootState} from '../index';

export const selectMountedBackups = (store: RootState) => store.mountedBackups.mountedBackups
export const selectMountedBackup = (store: RootState) => store.mountedBackups.mountedBackup
