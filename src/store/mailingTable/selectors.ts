import { RootState } from '../index';

export const selectMailingTable = (store: RootState) =>
  store.mailingTable.mailingTable;
