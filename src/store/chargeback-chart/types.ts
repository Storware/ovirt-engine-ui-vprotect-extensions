export const SET_CHARGEBACK_BACKUP_SIZE_DATA =
  'SET_CHARGEBACK_BACKUP_SIZE_DATA';
export const SET_CHARGEBACK_TRANSFER_SIZE_DATA =
  'SET_CHARGEBACK_TRANSFER_SIE_DATA';
export const SET_SORT_BY = 'SET_SORT_BY';
export const SET_PAGE = 'SET_PAGE';

export type SetChargebackBackupSizeData = {
  type: typeof SET_CHARGEBACK_BACKUP_SIZE_DATA;
  payload: any;
};

export type SetChargebackTransferSizeData = {
  type: typeof SET_CHARGEBACK_TRANSFER_SIZE_DATA;
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

export type ChargebackChartAction =
  | SetChargebackBackupSizeData
  | SetChargebackTransferSizeData
  | SetSortBy
  | SetPage;
