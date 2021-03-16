import {
  ChargebackChartAction,
  SET_CHARGEBACK_DATA,
  SET_PAGE,
  SET_SORT_BY,
} from 'store/chargeback-chart/types';
import { Dispatch } from 'redux';
import dashboardService from 'services/dashboard-service';

export const setChargebackData = (payload: any): ChargebackChartAction => {
  return {
    type: SET_CHARGEBACK_DATA,
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
        },
      ],
    }),
  );
};
