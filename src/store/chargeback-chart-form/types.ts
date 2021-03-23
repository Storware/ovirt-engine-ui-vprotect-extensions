export const SET_OPTIONS = 'SET_OPTIONS';

export type SetOptions = {
  type: typeof SET_OPTIONS;
  payload: any;
};

export type ChargebackChartFormAction = SetOptions;
