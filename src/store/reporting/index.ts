import { ReportingAction, SET_RANGE, SET_REPORT } from 'store/reporting/types';
import { Report } from 'model/report/report';
import { Range } from 'model/report/range';

export type ReportingStore = {
  readonly range: Range;
  readonly report: Report;
};

const initial: ReportingStore = {
  range: new Range(),
  report: new Report(),
};

export default (state = initial, action: ReportingAction) => {
  if (action.type === SET_RANGE) {
    return {
      ...state,
      range: action.payload,
    };
  }
  if (action.type === SET_REPORT) {
    return {
      ...state,
      report: action.payload,
    };
  }
  return state;
};
