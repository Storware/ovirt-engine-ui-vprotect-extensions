export const SET_POLICIES = 'SET_POLICIES';

export type SetPoliciesAction = {
  type: typeof SET_POLICIES;
  payload?: any[];
};

export type PoliciesAction = SetPoliciesAction;
