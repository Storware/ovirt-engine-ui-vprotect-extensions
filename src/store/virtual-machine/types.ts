export const SET_VIRTUAL_MACHINE = 'SET_VIRTUAL_MACHINE';
export const SET_HYPERVISOR = 'SET_HYPERVISOR';
export const SET_BACKUPS_HISTORY = 'SET_BACKUPS_HISTORY';
export const SET_RESTORES_HISTORY = 'SET_RESTORES_HISTORY';
export const SET_SNAPSHOTS = 'SET_SNAPSHOTS';

export type SetVirtualMachineAction = {
    type: typeof SET_VIRTUAL_MACHINE;
    payload?: any;
};

export type SetHypervisorAction = {
    type: typeof SET_HYPERVISOR;
    payload?: any;
};

export type SetBackupsHistoryAction = {
    type: typeof SET_BACKUPS_HISTORY;
    payload?: any;
};

export type SetRestoresHistoryAction = {
    type: typeof SET_RESTORES_HISTORY;
    payload?: any;
};

export type SetSnapshotsAction = {
    type: typeof SET_SNAPSHOTS;
    payload?: any;
};


export type VirtualMachineAction = SetVirtualMachineAction |
    SetHypervisorAction |
    SetBackupsHistoryAction |
    SetRestoresHistoryAction |
    SetSnapshotsAction;
