import {
  RESET_PAGINATION,
  SET_PAGE,
  SET_SIZE,
  SET_FILTER,
  SET_ORDER_BY,
  SET_DIRECTION,
  PaginationAction,
} from './types';
import { TableParams } from 'model/pagination/TableParams';

export type TableParamsStore = TableParams;

const initial: TableParamsStore = new TableParams();

export default (state = initial, action: PaginationAction) => {
  if (action.type === RESET_PAGINATION) {
    return initial;
  }
  if (action.type === SET_PAGE) {
    return {
      ...state,
      page: action.payload,
    };
  }
  if (action.type === SET_SIZE) {
    return {
      ...state,
      size: action.payload,
    };
  }
  if (action.type === SET_FILTER) {
    return {
      ...state,
      filter: action.payload,
    };
  }
  if (action.type === SET_ORDER_BY) {
    return {
      ...state,
      orderBy: action.payload,
    };
  }
  if (action.type === SET_DIRECTION) {
    return {
      ...state,
      direction: action.payload,
    };
  }
  return state;
};
