export const SET_TASK = 'SET_TASK';
export const SET_BACKUP_DESTINATIONS = 'SET_BACKUP_DESTINATIONS';
export const SET_BACKUP_TYPES = 'SET_BACKUP_TYPES';

export type SetTaskAction = {
    type: typeof SET_TASK;
    payload?: any;
};

export type SetBackupDestinations = {
    type: typeof SET_BACKUP_DESTINATIONS;
    payload?: any;
};

export type SetBackupTypes = {
    type: typeof SET_BACKUP_TYPES;
    payload?: any;
};


export type BackupModalAction =
    SetTaskAction |
    SetBackupDestinations |
    SetBackupTypes;
