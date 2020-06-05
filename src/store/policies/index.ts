import {
  PoliciesAction, SET_FILTERED_POLICIES, SET_POLICIES
} from './types';

export type PoliciesStore = {
  readonly policies: any[];
  readonly filteredPolicies: any[];
};

const initial: PoliciesStore = {
  policies: [],
  filteredPolicies: []
};

export default (state = initial, action: PoliciesAction) => {
  if (action.type === SET_POLICIES) {
    return {
      ...state,
      policies: action.payload,
      filteredPolicies: action.payload,
    };
  }
  if (action.type === SET_FILTERED_POLICIES) {
    return {
      ...state,
      filteredPolicies: action.payload,
    };
  }
  return state;
};
