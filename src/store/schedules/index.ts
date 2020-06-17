import { PoliciesAction, SET_FILTERED_SCHEDULES, SET_SCHEDULES } from './types';

export type PoliciesStore = {
  readonly schedules: any[];
  readonly filteredSchedules: any[];
};

const initial: PoliciesStore = {
  schedules: [],
  filteredSchedules: [],
};

export default (state = initial, action: PoliciesAction) => {
  if (action.type === SET_SCHEDULES) {
    return {
      ...state,
      schedules: action.payload,
      filteredSchedules: action.payload,
    };
  }
  if (action.type === SET_FILTERED_SCHEDULES) {
    return {
      ...state,
      filteredSchedules: action.payload,
    };
  }
  return state;
};
