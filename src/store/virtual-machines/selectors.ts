import {RootState} from '../index';

export const selectVirtualMachines = (store: RootState) => store.virtualMachines.virtualMachines
export const selectFilteredVirtualMachines = (store: RootState) => store.virtualMachines.filteredVirtualMachines
