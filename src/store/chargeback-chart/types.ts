export const SET_CHARGEBACK_DATA = 'SET_CHARGEBACK_DATA';
export const SET_SORT_BY = 'SET_SORT_BY';
export const SET_PAGE = 'SET_PAGE';

export type SetChargebackData = {
  type: typeof SET_CHARGEBACK_DATA;
  payload: any;
};

export type SetSortBy = {
  type: typeof SET_SORT_BY;
  payload: any;
};

export type SetPage = {
  type: typeof SET_PAGE;
  payload: number;
};

export type ChargebackChartAction = SetChargebackData | SetSortBy | SetPage;
