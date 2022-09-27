export const RESET_PAGINATION = 'RESET_PAGINATION';
export const SET_PAGE = 'SET_PAGE';
export const SET_SIZE = 'SET_SIZE';
export const SET_FILTER = 'SET_FILTER';
export const SET_ORDER_BY = 'SET_ORDER_BY';
export const SET_DIRECTION = 'SET_DIRECTION';

export type ResetPagination = {
  type: typeof RESET_PAGINATION;
};

export type SetPage = {
  type: typeof SET_PAGE;
  payload: number;
};

export type SetSize = {
  type: typeof SET_SIZE;
  payload: number;
};

export type SetFilter = {
  type: typeof SET_FILTER;
  payload: string;
};

export type SetOrderBy = {
  type: typeof SET_ORDER_BY;
  payload: string;
};

export type SetDirection = {
  type: typeof SET_DIRECTION;
  payload: string;
};

export type PaginationAction =
  | ResetPagination
  | SetPage
  | SetSize
  | SetFilter
  | SetOrderBy
  | SetDirection;
