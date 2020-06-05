import {
  SET_FILTERED_VIRTUAL_MACHINES,
  SET_VIRTUAL_MACHINES,
  VirtualMachinesAction
} from './types';

export type VirtualMachinesStore = {
  readonly virtualMachines: any[];
  readonly filteredVirtualMachines: any[];
};

const initial: VirtualMachinesStore = {
  virtualMachines: [],
  filteredVirtualMachines: [],
};

export default (state = initial, action: VirtualMachinesAction) => {
  if (action.type === SET_VIRTUAL_MACHINES) {
    return {
      ...state,
      virtualMachines: action.payload,
      filteredVirtualMachines: action.payload,
    };
  }
  if (action.type === SET_FILTERED_VIRTUAL_MACHINES) {
    return {
      ...state,
      filteredVirtualMachines: action.payload,
    };
  }
  return state;
};
