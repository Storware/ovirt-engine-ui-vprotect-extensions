import { MailingTableAction, SET_MAILING_TABLE } from './types';

export type MailingTableStore = {
  readonly mailingTable: any[];
};

const initial: MailingTableStore = {
  mailingTable: [],
};

export default (state = initial, action: MailingTableAction) => {
  if (action.type === SET_MAILING_TABLE) {
    return {
      ...state,
      mailingTable: action.payload,
      filteredMailingTable: action.payload,
    };
  }
  return state;
};
