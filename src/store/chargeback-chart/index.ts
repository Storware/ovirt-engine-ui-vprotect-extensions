import {
  ChargebackChartAction,
  SET_CHARGEBACK_DATA,
  SET_PAGE,
  SET_SORT_BY,
} from './types';

const chartData = {
  labels: [],
  datasets: [{ data: [], label: '' }],
};

export type ChargebackChart = {
  readonly chartData;
  readonly sortBy;
  readonly page: number;
};

const initial: ChargebackChart = {
  chartData,
  sortBy: {
    size: null,
    name: null,
  },
  page: 0,
};

export default (state = initial, action: ChargebackChartAction) => {
  if (action.type === SET_CHARGEBACK_DATA) {
    return {
      ...state,
      chartData: action.payload,
    };
  }
  if (action.type === SET_SORT_BY) {
    return {
      ...state,
      sortBy: action.payload,
    };
  }
  if (action.type === SET_PAGE) {
    return {
      ...state,
      page: action.payload,
    };
  }
  return state;
};
