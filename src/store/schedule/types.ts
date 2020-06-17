export const SET_SCHEDULE = 'SET_SCHEDULE';
export const SET_POLICIES = 'SET_POLICIES';

export type SetScheduleAction = {
  type: typeof SET_SCHEDULE;
  payload?: any;
};

export type SetPoliciesAction = {
  type: typeof SET_POLICIES;
  payload?: any[];
};

export type PolicyAction = SetScheduleAction | SetPoliciesAction;
