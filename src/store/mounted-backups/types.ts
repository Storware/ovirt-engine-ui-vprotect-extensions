export const SET_MOUNTED_BACKUPS = 'SET_MOUNTED_BACKUPS';
export const SET_MOUNTED_BACKUP = 'SET_MOUNTED_BACKUP';
export const SET_FILESYSTEMS = 'SET_FILESYSTEMS';
export const SET_FILES = 'SET_FILES';

export type SetMountedBackupsAction = {
    type: typeof SET_MOUNTED_BACKUPS;
    payload?: any[];
};

export type SetMountedBackupAction = {
    type: typeof SET_MOUNTED_BACKUP;
    payload?: any;
};

export type SetFileSystemsAction = {
    type: typeof SET_FILESYSTEMS;
    payload?: any[];
};

export type SetFilesAction = {
    type: typeof SET_FILES;
    payload?: any[];
};

export type MountedBackupsAction =
    SetMountedBackupsAction |
    SetMountedBackupAction |
    SetFileSystemsAction |
    SetFilesAction;
