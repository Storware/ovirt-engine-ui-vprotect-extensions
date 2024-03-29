import {
  MountedBackupsAction,
  SET_FILES,
  SET_FILESYSTEM_LISTING,
  SET_FILESYSTEMS,
  SET_MOUNTED_BACKUP,
  SET_MOUNTED_BACKUPS,
} from './types';
import { Dispatch } from 'redux';
import { backupsService } from '../../services/backups-service';
import { startLoading, stopLoading } from '../loading/actions';
import { TableParams } from 'model/pagination/TableParams';
import { setPaginationPage } from 'store/pagination/actions';

export const setMountedBackups = (payload: any): MountedBackupsAction => ({
  type: SET_MOUNTED_BACKUPS,
  payload,
});

export const setMountedBackup = (payload: any): MountedBackupsAction => ({
  type: SET_MOUNTED_BACKUP,
  payload,
});

export const setFileSystems = (payload: any): MountedBackupsAction => ({
  type: SET_FILESYSTEMS,
  payload,
});

export const setFiles = (payload: any): MountedBackupsAction => ({
  type: SET_FILES,
  payload,
});

export const setFileSystemListing = (payload: any): MountedBackupsAction => ({
  type: SET_FILESYSTEM_LISTING,
  payload,
});

export const getMountedBackupsListPage = async (dispatch: Dispatch) => {
  const mountedBackups = await backupsService.getAllMountedBackups();
  await dispatch(setMountedBackups(mountedBackups));
};

export const getMountedBackup = (guid) => async (dispatch: Dispatch) => {
  const mountedBackup = await backupsService.getMountedBackup(guid);
  await dispatch(setMountedBackup(mountedBackup));
};

export const getMountedBackupPage =
  (params: Partial<TableParams>) => async (dispatch: Dispatch) => {
    const mountedBackup = await backupsService.getMountedBackupPage(params);
    await dispatch(setMountedBackups(mountedBackup));
  };

export const getFileSystems = (guid) => async (dispatch: Dispatch) => {
  const fileSystems = await backupsService.getMountedBackupFilesystemsDetailed(
    guid,
  );
  await dispatch(setFileSystems(fileSystems));
};

export const getFiles = (guid) => async (dispatch: Dispatch) => {
  const files = await backupsService.getMountedBackupFiles(guid);
  await dispatch(setFiles(files));
};

export const getFilesystemListing =
  (guid, path) => async (dispatch: Dispatch) => {
    await dispatch(startLoading());
    try {
      const files = await backupsService.getMountedBackupFilesystemsListing(
        guid,
        path,
      );
      await dispatch(setFileSystemListing(files));
    } catch (e) {
      await dispatch(setFileSystemListing([]));
    } finally {
      await dispatch(stopLoading());
      dispatch(setPaginationPage(0));
    }
  };
