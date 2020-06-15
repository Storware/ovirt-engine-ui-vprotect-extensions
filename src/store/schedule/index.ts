import {
  SET_POLICIES,
  SET_SCHEDULE,
  PolicyAction
} from './types';

export type VirtualMachineStore = {
  readonly schedule: any;
  readonly policies: any[];
};

const initial: VirtualMachineStore = {
  schedule: {},
  policies: [],
};

export default (state = initial, action: PolicyAction) => {
  if (action.type === SET_SCHEDULE) {
    return {
      ...state,
      schedule: action.payload,
    };
  }
  if (action.type === SET_POLICIES) {
    return {
      ...state,
      policies: action.payload,
    };
  }
  return state;
};
