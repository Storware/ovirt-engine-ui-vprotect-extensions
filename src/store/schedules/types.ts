export const SET_SCHEDULES = 'SET_SCHEDULES';

export type SetSchedulesAction = {
  type: typeof SET_SCHEDULES;
  payload?: any[];
};

export type PoliciesAction = SetSchedulesAction;
