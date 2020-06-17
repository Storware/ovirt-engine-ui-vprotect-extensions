import {
  SET_BACKUPS_HISTORY,
  SET_DISKS,
  SET_HYPERVISOR,
  SET_POLICIES,
  SET_RESTORES_HISTORY,
  SET_SCHEDULES,
  SET_SNAPSHOT_POLICIES,
  SET_SNAPSHOTS,
  SET_VIRTUAL_MACHINE,
  VirtualMachineAction,
} from './types';

export type VirtualMachineStore = {
  readonly virtualMachine: any;
  readonly hypervisor: any;
  readonly backupsHistory: any[];
  readonly restoresHistory: any[];
  readonly snapshots: any[];
  readonly disks: any[];
  readonly schedules: any[];
  readonly policies: any[];
  readonly snapshotPolicies: any[];
};

const initial: VirtualMachineStore = {
  virtualMachine: {},
  hypervisor: {},
  backupsHistory: [],
  restoresHistory: [],
  snapshots: [],
  disks: [],
  schedules: [],
  policies: [],
  snapshotPolicies: [],
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
  if (action.type === SET_DISKS) {
    return {
      ...state,
      disks: action.payload,
    };
  }
  if (action.type === SET_SCHEDULES) {
    return {
      ...state,
      schedules: action.payload,
    };
  }
  if (action.type === SET_POLICIES) {
    return {
      ...state,
      policies: action.payload,
    };
  }
  if (action.type === SET_SNAPSHOT_POLICIES) {
    return {
      ...state,
      snapshotPolicies: action.payload,
    };
  }
  return state;
};
