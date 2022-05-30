import {Dispatch} from 'redux';
import {mailingService} from '../../services/mailing-list.service'
import {MailingTableAction, SET_MAILING_TABLE} from 'store/mailingTable/types';

export const setMailing = (payload: any[]): MailingTableAction => {
    return {
        type: SET_MAILING_TABLE,
        payload,
    };
}

export const getMailingTable = () => async (dispatch: Dispatch) => {
    const mailingList = await mailingService.getMailingLists();
    await dispatch(setMailing(mailingList))
};

export const removeMailingList = (guid: string) => async (
    dispatch: Dispatch,
) => {
    await mailingService.deleteMailingList(guid);
    const mailingList = await mailingService.getMailingLists();
    await dispatch(setMailing(mailingList))
};
