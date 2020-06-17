import {
  SET_MOUNTED_BACKUPS,
  MountedBackupsAction,
  SET_MOUNTED_BACKUP,
  SET_FILESYSTEMS,
  SET_FILES,
  SET_FILESYSTEM_LISTING,
} from './types';

export type MountedBackupsStore = {
  readonly mountedBackups: any[];
  readonly mountedBackup: any;
  readonly fileSystems: any[];
  readonly files: any[];
  readonly fileSystemListing: any[];
};

const initial: MountedBackupsStore = {
  mountedBackups: [],
  mountedBackup: {},
  fileSystems: [],
  files: [],
  fileSystemListing: [],
};

export default (state = initial, action: MountedBackupsAction) => {
  if (action.type === SET_MOUNTED_BACKUPS) {
    return {
      ...state,
      mountedBackups: action.payload,
    };
  }
  if (action.type === SET_MOUNTED_BACKUP) {
    return {
      ...state,
      mountedBackup: action.payload,
    };
  }
  if (action.type === SET_FILESYSTEMS) {
    return {
      ...state,
      fileSystems: action.payload,
    };
  }
  if (action.type === SET_FILES) {
    return {
      ...state,
      files: action.payload,
    };
  }
  if (action.type === SET_FILESYSTEM_LISTING) {
    return {
      ...state,
      fileSystemListing: action.payload,
    };
  }
  return state;
};
