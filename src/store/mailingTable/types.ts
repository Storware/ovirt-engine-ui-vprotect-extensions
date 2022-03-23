export const SET_MAILING_TABLE = 'SET_MAILING_TABLE';

export type SetMailingTableAction = {
  type: typeof SET_MAILING_TABLE;
  payload?: any[];
};

export type MailingTableAction = SetMailingTableAction;
