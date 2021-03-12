import {
  ChargebackChartAction,
  SET_CHARGEBACK_DATA,
  SET_PAGE,
  SET_PAGINATED_CHARGEBACK_DATA,
  SET_SORT_BY,
  SET_SORTED_CHARGEBACK_DATA,
} from './types';

const chartData = {
  labels: [],
  datasets: [{ data: [], label: '' }],
};

export type ChargebackChart = {
  readonly chartData;
  readonly sortedChartData;
  readonly paginatedChartData;
  readonly sortBy;
  readonly page: number;
};

const initial: ChargebackChart = {
  chartData,
  sortedChartData: chartData,
  paginatedChartData: chartData,
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
  if (action.type === SET_SORTED_CHARGEBACK_DATA) {
    return {
      ...state,
      sortedChartData: action.payload,
    };
  }
  if (action.type === SET_PAGINATED_CHARGEBACK_DATA) {
    return {
      ...state,
      paginatedChartData: action.payload,
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
