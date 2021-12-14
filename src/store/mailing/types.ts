export const SET_MAILING = 'SET_MAILING';

export type SetMailingAction = {
    type: typeof SET_MAILING;
    payload?: any[];
};

export type MailingAction = SetMailingAction;
