import {
  SET_BACKUPS_HISTORY,
  SET_HYPERVISOR,
  SET_RESTORES_HISTORY, SET_SNAPSHOTS,
  SET_VIRTUAL_MACHINE,
  VirtualMachineAction
} from './types';

export type VirtualMachineStore = {
  readonly virtualMachine: any;
  readonly hypervisor: any;
  readonly backupsHistory: any[];
  readonly restoresHistory: any[];
  readonly snapshots: any[];
};

const initial: VirtualMachineStore = {
  virtualMachine: {},
  hypervisor: {},
  backupsHistory: [],
  restoresHistory: [],
  snapshots: []
};

export default (state = initial, action: VirtualMachineAction) => {
  if (action.type === SET_VIRTUAL_MACHINE) {
    return {
      ...state,
      virtualMachine: action.payload,
    };
  }
  if (action.type === SET_HYPERVISOR) {
    return {
      ...state,
      hypervisor: action.payload,
    };
  }
  if (action.type === SET_BACKUPS_HISTORY) {
    return {
      ...state,
      backupsHistory: action.payload,
    };
  }
  if (action.type === SET_RESTORES_HISTORY) {
    return {
      ...state,
      restoresHistory: action.payload,
    };
  }
  if (action.type === SET_SNAPSHOTS) {
    return {
      ...state,
      snapshots: action.payload,
    };
  }
  return state;
};
