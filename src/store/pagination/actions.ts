import {
  PaginationAction,
  RESET_PAGINATION,
  SET_DIRECTION,
  SET_FILTER,
  SET_ORDER_BY,
  SET_PAGE,
  SET_SIZE,
} from './types';

export const resetPagination = (): PaginationAction => ({
  type: RESET_PAGINATION,
});

export const setPaginationPage = (payload: number): PaginationAction => ({
  type: SET_PAGE,
  payload,
});

export const setPaginationSize = (payload: number): PaginationAction => ({
  type: SET_SIZE,
  payload,
});

export const setPaginationFilter = (payload: string): PaginationAction => ({
  type: SET_FILTER,
  payload,
});

export const setPaginationOrderBy = (payload: string): PaginationAction => ({
  type: SET_ORDER_BY,
  payload,
});

export const setPaginationDirection = (payload: string): PaginationAction => ({
  type: SET_DIRECTION,
  payload,
});
