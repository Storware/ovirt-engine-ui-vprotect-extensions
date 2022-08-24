import { FilterState } from 'model/export-report/filterState';

export const SET_BACKUP_FILTER = 'SET_BACKUP_FILTER';
export const SET_TRANSFER_FILTER = 'SET_TRANSFER_FILTER';
export const SET_EXPORT_EMAIL = 'SET_EXPORT_EMAIL';

export type SetBackupFilter = {
  type: typeof SET_BACKUP_FILTER;
  payload: FilterState;
};

export type setTransferFilter = {
  type: typeof SET_TRANSFER_FILTER;
  payload: FilterState;
};

export type setExportEmail = {
  type: typeof SET_EXPORT_EMAIL;
  payload: string;
};

export type ExportReportAction =
  | SetBackupFilter
  | setTransferFilter
  | setExportEmail;
