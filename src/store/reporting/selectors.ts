import { RootState } from '../index';

export const selectRange = (store: RootState) => store.reporting.range;
export const selectReport = (store: RootState) => store.reporting.report;
