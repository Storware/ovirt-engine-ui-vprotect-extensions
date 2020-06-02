import {RootState} from '../index';

export const selectMountedBackups = (store: RootState) => store.mountedBackups.mountedBackups
export const selectMountedBackup = (store: RootState) => store.mountedBackups.mountedBackup
export const selectFileSystems = (store: RootState) => store.mountedBackups.fileSystems
export const selectFiles = (store: RootState) => store.mountedBackups.files
export const selectFileSystemListing = (store: RootState) => store.mountedBackups.fileSystemListing
