import { SET_USER, UserAction } from './types';

export type UserStore = {
  readonly user?: any;
};

const initial: UserStore = {};

export default (state = initial, action: UserAction) => {
  if (action.type === SET_USER) {
    return {
      ...state,
      token: action.payload,
    };
  }
  return state;
};
