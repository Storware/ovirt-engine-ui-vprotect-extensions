import {
  MountBackupModalAction,
  SET_BACKUP_FILES,
  SET_ISCSI_MOUNTABLE,
  SET_MANUAL_MOUNT_FILESYSTEMS,
  SET_MOUNTABLE_BACKUPS,
  SET_NODES,
} from './types';
import { Dispatch } from 'redux';
import { backupsService } from '../../services/backups-service';
import { tasksService } from '../../services/tasks-service';
import { alertService } from '../../services/alert-service';
import { nodesService } from '../../services/nodes-service';
import { BackupTask } from '../../model/tasks/backup-task';
import { hideModalAction, unsaveModalAction } from '../modal/actions';
import { MountedFileSystemRequest } from '../../model/tasks/mounted-file-system-request';
import moment from 'moment-timezone';
import { BackupFile } from '../../model/backup-file';

export const setMountableBackupsAction = (
  payload: any[],
): MountBackupModalAction => {
  return {
    type: SET_MOUNTABLE_BACKUPS,
    payload,
  };
};

export const setNodesAction = (payload: any[]): MountBackupModalAction => {
  return {
    type: SET_NODES,
    payload,
  };
};

export const setManualMountFilesystemsAction = (
  payload: any[],
): MountBackupModalAction => {
  return {
    type: SET_MANUAL_MOUNT_FILESYSTEMS,
    payload,
  };
};

export const setIscsiMountableAction = (
  payload: boolean,
): MountBackupModalAction => {
  return {
    type: SET_ISCSI_MOUNTABLE,
    payload,
  };
};

export const setBackupFilesAction = (
  payload: BackupFile[],
): MountBackupModalAction => {
  return {
    type: SET_BACKUP_FILES,
    payload,
  };
};

export const getMountedBackup = (guid: string) => async (
  dispatch: Dispatch,
) => {
  const mountableBackups = await backupsService.getMountableBackups(guid);
  await dispatch(setMountableBackupsAction(mountableBackups));
  const nodes = await nodesService.getAllNodes();
  await dispatch(setNodesAction(nodes));
};

export const getBackupFilesystems = (backup: any) => async (
  dispatch: Dispatch,
) => {
  const data = await backupsService.getBackupFileSystems(backup.guid);
  const manualMountFileSystems = [];
  data.forEach((element) => {
    const ms = new MountedFileSystemRequest();
    ms.fileSystem = element;
    ms.mountPath =
      '/mnt/vprotect/' +
      backup.protectedEntity.name +
      '/' +
      moment(backup.snapshotTime).format('YYYYMMDD_HHmmss') +
      '/' +
      element.volume.replace(/^.*[\\\/]/, '');
    manualMountFileSystems.push(ms);
  });
  await dispatch(setManualMountFilesystemsAction(manualMountFileSystems));
};

export const checkIfIscsiMountable = (backup: any) => async (
  dispatch: Dispatch,
) => {
  const data = await backupsService.getBackup(backup.guid);
  await dispatch(setIscsiMountableAction(data.iscsiMountable));
  if (data.iscsiMountable) {
    await dispatch(await getBackupFiles(backup));
  }
};

export const getBackupFiles = async (backup: any) => {
  const data = await backupsService.getBackupFiles(backup.guid);

  return setBackupFilesAction(
    data.filter((el) => {
      return el.hasOwnProperty('iscsiMountable') && el.iscsiMountable === true;
    }),
  );
};

export const submitTask = (task: BackupTask) => async (dispatch: Dispatch) => {
  try {
    await tasksService.submitTaskRestoreAndMount(task);
    alertService.info('Restore and Mount task has been submitted');
    await dispatch(hideModalAction());
  } catch (e) {
    await dispatch(unsaveModalAction());
  }
};
