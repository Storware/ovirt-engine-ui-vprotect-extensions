import { FilterState } from './filterState';

export class ExportRequest {
  backupSize = new FilterState();
  transferSize = new FilterState();
  value = '';
}
