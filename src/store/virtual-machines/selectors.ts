import { RootState } from '../index';

export const selectVirtualMachines = (store: RootState) =>
  store.virtualMachines.virtualMachines;
