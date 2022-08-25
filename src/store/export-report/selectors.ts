import { RootState } from '../index';

export const selectExportEmail = (store: RootState) => store.exportReport.value;
export const selectExportRequest = (store: RootState) => store.exportReport;
export const selectBackupSizeFilters = (store: RootState) =>
  store.exportReport.backupSize;
export const selectTransferSizeFilters = (store: RootState) =>
  store.exportReport.transferSize;
