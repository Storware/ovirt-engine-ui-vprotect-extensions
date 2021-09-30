export const SET_VIRTUAL_MACHINES = 'SET_VIRTUAL_MACHINES';

export type SetVirtualMachinesAction = {
  type: typeof SET_VIRTUAL_MACHINES;
  payload?: any[];
};

export type VirtualMachinesAction = SetVirtualMachinesAction;
