import {
  ExportReportAction,
  SET_BACKUP_FILTER,
  SET_EXPORT_EMAIL,
  SET_TRANSFER_FILTER,
} from './types';

import { FilterState } from 'model/export-report/filterState';

export const setBackupFilter = (payload: FilterState): ExportReportAction => ({
  type: SET_BACKUP_FILTER,
  payload,
});

export const setTransferFilter = (
  payload: FilterState,
): ExportReportAction => ({
  type: SET_TRANSFER_FILTER,
  payload,
});

export const setExportEmail = (payload: string): ExportReportAction => ({
  type: SET_EXPORT_EMAIL,
  payload,
});
