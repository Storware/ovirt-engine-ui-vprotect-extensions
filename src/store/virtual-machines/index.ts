import { SET_VIRTUAL_MACHINES, VirtualMachinesAction } from './types';

export type VirtualMachinesStore = {
  readonly virtualMachines: any[];
};

const initial: VirtualMachinesStore = {
  virtualMachines: [],
};

export default (state = initial, action: VirtualMachinesAction) => {
  if (action.type === SET_VIRTUAL_MACHINES) {
    return {
      ...state,
      virtualMachines: action.payload,
    };
  }
  return state;
};
