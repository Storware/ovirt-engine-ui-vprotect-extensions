import {MountedBackupsAction, SET_MOUNTED_BACKUP, SET_MOUNTED_BACKUPS} from './types';
import {Dispatch} from 'redux';
import {backupsService} from '../../components/vprotect/services/backups-service';

export const setMountedBackups = (payload: any): MountedBackupsAction => {
    return {
        type: SET_MOUNTED_BACKUPS,
        payload
    };
};

export const setMountedBackup = (payload: any): MountedBackupsAction => {
    return {
        type: SET_MOUNTED_BACKUP,
        payload
    };
};

export const getMountedBackupsListPage = async (dispatch: Dispatch) => {
    const mountedBackups = await backupsService.getAllMountedBackups()
    await dispatch(setMountedBackups(mountedBackups));
};

export const getMountedBackupsPage = (guid) => async (dispatch: Dispatch) => {
    const mountedBackup = await backupsService.getMountedBackup(guid)
    await dispatch(setMountedBackup(mountedBackup));
};
