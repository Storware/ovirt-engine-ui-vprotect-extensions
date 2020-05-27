export const SET_MOUNTED_BACKUPS = 'SET_MOUNTED_BACKUPS';
export const SET_MOUNTED_BACKUP = 'SET_MOUNTED_BACKUP';

export type SetMountedBackupsAction = {
    type: typeof SET_MOUNTED_BACKUPS;
    payload?: any[];
};

export type SetMountedBackupAction = {
    type: typeof SET_MOUNTED_BACKUP;
    payload?: any;
};

export type MountedBackupsAction =
    SetMountedBackupsAction |
    SetMountedBackupAction;
