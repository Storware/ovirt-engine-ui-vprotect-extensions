export const SET_TASK = 'SET_TASK';
export const SET_MOUNTABLE_BACKUPS = 'SET_MOUNTABLE_BACKUPS';
export const SET_NODES = 'SET_NODES';

export type SetTaskAction = {
    type: typeof SET_TASK;
    payload?: any;
};

export type SetMountableBackupsAction = {
    type: typeof SET_MOUNTABLE_BACKUPS;
    payload?: any[];
};

export type SetNodesAction = {
    type: typeof SET_NODES;
    payload?: any[];
};


export type MountBackupModalAction =
    SetTaskAction |
    SetMountableBackupsAction |
    SetNodesAction;
