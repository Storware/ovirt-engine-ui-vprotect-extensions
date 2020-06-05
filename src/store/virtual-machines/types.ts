export const SET_VIRTUAL_MACHINES = 'SET_VIRTUAL_MACHINES';
export const SET_FILTERED_VIRTUAL_MACHINES = 'SET_FILTERED_VIRTUAL_MACHINES';

export type SetVirtualMachinesAction = {
    type: typeof SET_VIRTUAL_MACHINES;
    payload?: any[];
};

export type SetFilteredVirtualMachinesAction = {
    type: typeof SET_FILTERED_VIRTUAL_MACHINES;
    payload?: any[];
};

export type VirtualMachinesAction =
    SetVirtualMachinesAction |
    SetFilteredVirtualMachinesAction;
