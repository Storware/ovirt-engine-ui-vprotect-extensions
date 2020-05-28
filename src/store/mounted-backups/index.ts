import {
  SET_MOUNTED_BACKUPS,
  MountedBackupsAction, SET_MOUNTED_BACKUP, SET_FILESYSTEMS, SET_FILES
} from './types';

export type MountedBackupsStore = {
  readonly mountedBackups: any[];
  readonly mountedBackup: any;
  readonly fileSystems: any[];
  readonly files: any[];
};

const initial: MountedBackupsStore = {
  mountedBackups: [],
  mountedBackup: {},
  fileSystems: [],
  files: []
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
  return state;
};
