import { PoliciesAction, SET_POLICIES } from './types';

export type PoliciesStore = {
  readonly policies: any[];
};

const initial: PoliciesStore = {
  policies: [],
};

export default (state = initial, action: PoliciesAction) => {
  if (action.type === SET_POLICIES) {
    return {
      ...state,
      policies: action.payload,
      filteredPolicies: action.payload,
    };
  }
  return state;
};
