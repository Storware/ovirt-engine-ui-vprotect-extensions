import {
  ChargebackChartAction,
  SET_CHARGEBACK_DATA,
  SET_PAGE,
  SET_PAGINATED_CHARGEBACK_DATA,
  SET_SORT_BY,
  SET_SORTED_CHARGEBACK_DATA,
} from 'store/chargeback-chart/types';
import { Dispatch } from 'redux';
import dashboardService from 'services/dashboard-service';
import { colors } from 'pages/dashboard/chargeback/colors';

export const setChargebackData = (payload: any): ChargebackChartAction => {
  return {
    type: SET_CHARGEBACK_DATA,
    payload,
  };
};

export const setSortedChargebackData = (
  payload: any,
): ChargebackChartAction => {
  return {
    type: SET_SORTED_CHARGEBACK_DATA,
    payload,
  };
};

export const setPaginatedChargebackData = (
  payload: any,
): ChargebackChartAction => {
  return {
    type: SET_PAGINATED_CHARGEBACK_DATA,
    payload,
  };
};

export const setSortBy = (payload: any): ChargebackChartAction => {
  return {
    type: SET_SORT_BY,
    payload,
  };
};

export const setPage = (payload: number): ChargebackChartAction => {
  return {
    type: SET_PAGE,
    payload,
  };
};

export const getChargeBackData = async (dispatch: Dispatch) => {
  const chartData = await dashboardService.getChargeBackReport();

  await dispatch(
    setChargebackData({
      labels: chartData.map((el) => el.name),
      datasets: [
        {
          data: chartData.map((el) => el.size),
          label: 'Size',
          backgroundColor: colors[0].backgroundColor,
        },
      ],
    }),
  );
};
