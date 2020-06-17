import { RootState } from '../index';

export const selectSchedule = (store: RootState) => store.schedule.schedule;
export const selectPolicies = (store: RootState) => store.schedule.policies;
