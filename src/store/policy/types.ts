export const SET_POLICY = 'SET_POLICY';
export const SET_HYPERVISOR_CLUSTERS = 'SET_HYPERVISOR_CLUSTERS';
export const SET_VIRTUAL_MACHINES = 'SET_VIRTUAL_MACHINES';
export const SET_BACKUP_DESTINATIONS = 'SET_BACKUP_DESTINATIONS';
export const SET_SCHEDULES = 'SET_SCHEDULES';

export type SetPolicyAction = {
    type: typeof SET_POLICY;
    payload?: any;
};

export type SetHypervisorClustersAction = {
    type: typeof SET_HYPERVISOR_CLUSTERS;
    payload?: any;
};

export type SetVirtualMachinesAction = {
    type: typeof SET_VIRTUAL_MACHINES;
    payload?: any;
};

export type SetBackupDestinationsAction = {
    type: typeof SET_BACKUP_DESTINATIONS;
    payload?: any;
};

export type SetSchedulesAction = {
    type: typeof SET_SCHEDULES;
    payload?: any;
};

export type PolicyAction = SetPolicyAction |
    SetHypervisorClustersAction |
    SetVirtualMachinesAction |
    SetBackupDestinationsAction |
    SetSchedulesAction;
