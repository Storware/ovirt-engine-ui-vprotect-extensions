import { BackupFile } from '../../model/backup-file';

export const SET_MOUNTABLE_BACKUPS = 'SET_MOUNTABLE_BACKUPS';
export const SET_NODE_CONFIGURATIONS = 'SET_NODE_CONFIGURATIONS';
export const SET_MANUAL_MOUNT_FILESYSTEMS = 'SET_MANUAL_MOUNT_FILESYSTEMS';
export const SET_ISCSI_MOUNTABLE = 'SET_ISCSI_MOUNTABLE';
export const SET_BACKUP_FILES = 'SET_BACKUP_FILES';

export type SetMountableBackupsAction = {
  type: typeof SET_MOUNTABLE_BACKUPS;
  payload?: any[];
};

export type SetNodesAction = {
  type: typeof SET_NODE_CONFIGURATIONS;
  payload?: any[];
};

export type SetManualMountFilesystemsAction = {
  type: typeof SET_MANUAL_MOUNT_FILESYSTEMS;
  payload?: any[];
};

export type SetIscsiMountableAction = {
  type: typeof SET_ISCSI_MOUNTABLE;
  payload?: boolean;
};

export type SetBackupFiles = {
  type: typeof SET_BACKUP_FILES;
  payload?: BackupFile[];
};

export type MountBackupModalAction =
  | SetMountableBackupsAction
  | SetNodesAction
  | SetManualMountFilesystemsAction
  | SetIscsiMountableAction
  | SetBackupFiles;
