import {
  SET_VIRTUAL_MACHINES,
  SET_HYPERVISOR_CLUSTERS,
  SET_BACKUP_DESTINATIONS,
  SET_SCHEDULES,
  SET_POLICY,
  PolicyAction,
} from './types';
import { PolicySnapshot } from '../../model/policies/policy-snapshot';

export type VirtualMachineStore = {
  readonly policy: any;
  readonly hypervisorClusters: any[];
  readonly virtualMachines: any[];
  readonly backupDestinations: any[];
  readonly schedules: any[];
};

const initial: VirtualMachineStore = {
  policy: new PolicySnapshot(),
  hypervisorClusters: [],
  virtualMachines: [],
  backupDestinations: [],
  schedules: [],
};

export default (state = initial, action: PolicyAction) => {
  if (action.type === SET_POLICY) {
    return {
      ...state,
      policy: action.payload,
    };
  }
  if (action.type === SET_HYPERVISOR_CLUSTERS) {
    return {
      ...state,
      hypervisorClusters: action.payload,
    };
  }
  if (action.type === SET_VIRTUAL_MACHINES) {
    return {
      ...state,
      virtualMachines: action.payload,
    };
  }
  if (action.type === SET_BACKUP_DESTINATIONS) {
    return {
      ...state,
      backupDestinations: action.payload,
    };
  }
  if (action.type === SET_SCHEDULES) {
    return {
      ...state,
      schedules: action.payload,
    };
  }
  return state;
};
