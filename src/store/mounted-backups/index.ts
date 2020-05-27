import {
  SET_MOUNTED_BACKUPS,
  MountedBackupsAction, SET_MOUNTED_BACKUP
} from './types';

export type MountedBackupsStore = {
  readonly mountedBackups: any[];
  readonly mountedBackup: any;
};

const initial: MountedBackupsStore = {
  mountedBackups: [],
  mountedBackup: {}
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
  return state;
};
