import { Dispatch } from 'redux';
import { mailingService } from '../../services/mailing-list.service';
import {
  MailingTableAction,
  SET_MAILING_TABLE,
} from 'store/mailingTable/types';
import { TableParams } from 'model/pagination/TableParams';

export const setMailing = (payload: any[]): MailingTableAction => ({
  type: SET_MAILING_TABLE,
  payload,
});

export const getMailingTablePage =
  (params: Partial<TableParams>) => async (dispatch: Dispatch) => {
    const mailingList = await mailingService.getMailingListPage(params);
    await dispatch(setMailing(mailingList));
  };

export const removeMailingList =
  (guid: string) => async (dispatch: Dispatch) => {
    await mailingService.deleteMailingList(guid);
    const mailingList = await mailingService.getMailingLists();
    await dispatch(setMailing(mailingList));
  };
