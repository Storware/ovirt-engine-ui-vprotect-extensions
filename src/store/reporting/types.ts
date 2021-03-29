import { Range } from 'model/report/range';
import { Report } from 'model/report/report';

export const SET_RANGE = 'SET_RANGE';
export const SET_REPORT = 'SET_REPORT';

export type SetRange = {
  type: typeof SET_RANGE;
  payload: Range;
};

export type SetReport = {
  type: typeof SET_REPORT;
  payload: Report;
};

export type ReportingAction = SetRange | SetReport;
