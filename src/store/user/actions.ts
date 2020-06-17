import { SET_USER, UserAction } from './types';
import { Dispatch } from 'redux';

export const setUser = (user?: string): UserAction => {
  user
    ? sessionStorage.setItem('user', user)
    : sessionStorage.removeItem('user');
  return {
    type: SET_USER,
    payload: user,
  };
};

export const getUserFromSessionStorage = async (dispatch: Dispatch) => {
  const user = await localStorage.getItem('user');
  if (user) {
    const r = await dispatch(setUser(user));
    return r;
  }
};
