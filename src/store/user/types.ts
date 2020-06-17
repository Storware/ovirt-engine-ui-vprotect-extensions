export const SET_USER = 'SET_USER';

export type SetUserAction = {
  type: typeof SET_USER;
  payload?: string;
};

export type UserAction = SetUserAction;
