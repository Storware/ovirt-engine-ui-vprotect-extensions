import { MailingAction, SET_MAILING } from './types';

export type MailingStore = {
  readonly mailing: any[];
};

const initial: MailingStore = {
  mailing: [],
};

export default (state = initial, action: MailingAction) => {
  if (action.type === SET_MAILING) {
    return {
      ...state,
      mailing: action.payload,
    };
  }
  return state;
};
