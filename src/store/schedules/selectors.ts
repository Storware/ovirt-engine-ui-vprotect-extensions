import { RootState } from '../index';

export const selectSchedules = (store: RootState) => store.schedules.schedules;
