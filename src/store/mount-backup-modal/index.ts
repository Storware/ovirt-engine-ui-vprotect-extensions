import {
  MountBackupModalAction,
  SET_BACKUP_FILES,
  SET_ISCSI_MOUNTABLE,
  SET_MANUAL_MOUNT_FILESYSTEMS,
  SET_MOUNTABLE_BACKUPS,
  SET_NODE_CONFIGURATIONS,
} from './types';
import { MountedFileSystemRequest } from '../../model/tasks/mounted-file-system-request';
import { BackupFile } from '../../model/backup-file';

export type MountedBackupStore = {
  readonly nodeConfigurations: any[];
  readonly mountableBackups: any[];
  readonly manualMountFileSystems: MountedFileSystemRequest[];
  readonly iscsiMountable: boolean;
  readonly backupFiles: BackupFile[];
};

const initial: MountedBackupStore = {
  nodeConfigurations: [],
  mountableBackups: [],
  manualMountFileSystems: [],
  iscsiMountable: false,
  backupFiles: [],
};

export default (state = initial, action: MountBackupModalAction) => {
  if (action.type === SET_MOUNTABLE_BACKUPS) {
    return {
      ...state,
      mountableBackups: action.payload,
    };
  }
  if (action.type === SET_NODE_CONFIGURATIONS) {
    return {
      ...state,
      nodeConfigurations: action.payload,
    };
  }
  if (action.type === SET_MANUAL_MOUNT_FILESYSTEMS) {
    return {
      ...state,
      manualMountFileSystems: action.payload,
    };
  }
  if (action.type === SET_ISCSI_MOUNTABLE) {
    return {
      ...state,
      iscsiMountable: action.payload,
    };
  }
  if (action.type === SET_BACKUP_FILES) {
    return {
      ...state,
      backupFiles: action.payload,
    };
  }
  return state;
};
