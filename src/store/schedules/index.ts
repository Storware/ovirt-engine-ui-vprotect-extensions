import { PoliciesAction, SET_SCHEDULES } from './types';

export type PoliciesStore = {
  readonly schedules: any[];
};

const initial: PoliciesStore = {
  schedules: [],
};

export default (state = initial, action: PoliciesAction) => {
  if (action.type === SET_SCHEDULES) {
    return {
      ...state,
      schedules: action.payload,
      filteredSchedules: action.payload,
    };
  }
  return state;
};
