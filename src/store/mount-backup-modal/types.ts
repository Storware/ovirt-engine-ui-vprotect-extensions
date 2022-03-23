import { BackupFile } from '../../model/backup-file';
import { RestoreAndMountTask } from 'model/tasks/restore-and-mount-task';

export const SET_MOUNTABLE_BACKUPS = 'SET_MOUNTABLE_BACKUPS';
export const SET_NODES = 'SET_NODES';
export const SET_MANUAL_MOUNT_FILESYSTEMS = 'SET_MANUAL_MOUNT_FILESYSTEMS';
export const SET_ISCSI_MOUNTABLE = 'SET_ISCSI_MOUNTABLE';
export const SET_BACKUP_FILES = 'SET_BACKUP_FILES';
export const SET_TASK = 'SET_BACKUP_TASK';

export const RESET_TASK = 'RESET_TASK';

export type SetMountableBackupsAction = {
  type: typeof SET_MOUNTABLE_BACKUPS;
  payload?: any[];
};

export type SetNodesAction = {
  type: typeof SET_NODES;
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

export type SetTask = {
  type: typeof SET_TASK;
  payload?: RestoreAndMountTask;
};

export type ResetTask = {
  type: typeof RESET_TASK;
};

export type MountBackupModalAction =
  | SetMountableBackupsAction
  | SetNodesAction
  | SetManualMountFilesystemsAction
  | SetIscsiMountableAction
  | SetTask
  | ResetTask
  | SetBackupFiles;
