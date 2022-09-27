import { RootState } from '../index';

export const selectPagination = (store: RootState) => store.tableParams;
