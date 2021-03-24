export const SET_PROPERTY_OPTIONS = 'SET_PROPERTY_OPTIONS';

export type SetPropertyOptions = {
  type: typeof SET_PROPERTY_OPTIONS;
  payload: any;
};

export type ChargebackChartFormAction = SetPropertyOptions;
