import { ReportingAction, SET_RANGE, SET_REPORT } from './types';

import { Range } from 'model/report/range';
import { Report } from 'model/report/report';
import { Dispatch } from 'redux';
import dashboardService from 'services/dashboard-service';

export const setRange = (payload: Range): ReportingAction => ({
  type: SET_RANGE,
  payload,
});

export const setReport = (payload: Report): ReportingAction => ({
  type: SET_REPORT,
  payload,
});

export const getReport = (range: Range) => async (dispatch: Dispatch) => {
  await dispatch(setReport(await dashboardService.getReport(range)));
};
