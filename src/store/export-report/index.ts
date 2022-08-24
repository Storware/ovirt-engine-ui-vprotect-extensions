import {
  ExportReportAction,
  SET_BACKUP_FILTER,
  SET_EXPORT_EMAIL,
  SET_TRANSFER_FILTER,
} from './types';
import { ExportRequest } from 'model/export-report/exportRequest';

const initial: ExportRequest = new ExportRequest();

export default (state = initial, { type, payload }) => {
  if (type === SET_BACKUP_FILTER) {
    return {
      ...state,
      backupSize: payload,
    };
  }
  if (type === SET_TRANSFER_FILTER) {
    return {
      ...state,
      transferSize: payload,
    };
  }
  if (type === SET_EXPORT_EMAIL) {
    return {
      ...state,
      value: payload,
    };
  }
  return state;
};
