export const SET_SCHEDULES = 'SET_SCHEDULES';
export const SET_FILTERED_SCHEDULES = 'SET_FILTERED_SCHEDULES';

export type SetSchedulesAction = {
    type: typeof SET_SCHEDULES;
    payload?: any[];
};

export type SetFilteredSchedulesAction = {
    type: typeof SET_FILTERED_SCHEDULES;
    payload?: any[];
};

export type PoliciesAction =
    SetSchedulesAction |
    SetFilteredSchedulesAction;
