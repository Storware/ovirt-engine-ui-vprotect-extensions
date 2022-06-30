import {
  ChargebackChartAction,
  SET_CHARGEBACK_BACKUP_SIZE_DATA,
  SET_CHARGEBACK_TRANSFER_SIZE_DATA,
  SET_PAGE,
  SET_SORT_BY,
} from 'store/chargeback-chart/types';
import { Dispatch } from 'redux';
import dashboardService from 'services/dashboard-service';
import { ChargebackRequest } from 'model/chargeback/vm-chargeback-request';

export const setChargebackBackupSizeData = (
  payload: any,
): ChargebackChartAction => ({
  type: SET_CHARGEBACK_BACKUP_SIZE_DATA,
  payload,
});

export const setChargebackTransferSizeData = (
  payload: any,
): ChargebackChartAction => ({
  type: SET_CHARGEBACK_TRANSFER_SIZE_DATA,
  payload,
});

export const setSortBy = (payload: any): ChargebackChartAction => ({
  type: SET_SORT_BY,
  payload,
});

export const setPage = (payload: number): ChargebackChartAction => ({
  type: SET_PAGE,
  payload,
});

const _setChargebackData = (chartData) => ({
  labels: chartData.map((el) => el.name),
  datasets: [
    {
      data: chartData.map((el) => el.size),
      label: 'Size',
    },
  ],
});

export const getChargebackBackupSizeData =
  (params, chargebackRequest: ChargebackRequest) =>
  async (dispatch: Dispatch) => {
    const chartData = await dashboardService.getChargebackBackupSizeReport(
      params,
      chargebackRequest,
    );
    dispatch(setChargebackBackupSizeData(_setChargebackData(chartData)));
  };

export const getChargebackTransferSizeData =
  (params, chargebackRequest: ChargebackRequest) =>
  async (dispatch: Dispatch) => {
    const chartData = await dashboardService.getChargebackTransferSizeReport(
      params,
      chargebackRequest,
    );
    dispatch(setChargebackTransferSizeData(_setChargebackData(chartData)));
  };
