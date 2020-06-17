import { RootState } from '../index';

export const selectSchedules = (store: RootState) => store.schedules.schedules;
export const selectFilteredSchedules = (store: RootState) =>
  store.schedules.filteredSchedules;
