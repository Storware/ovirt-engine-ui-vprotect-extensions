import { MailingAction, SET_MAILING } from 'store/mailing/types';
import { Dispatch } from 'redux';
import { mailingService } from 'services/mailing-list.service';

export const setMailingActions = (payload: any[]): MailingAction => ({
  type: SET_MAILING,
  payload,
});

export const getMailingList = (guid) => async (dispatch: Dispatch) => {
  if (guid !== 'create') {
    const mailingList = await mailingService.getMailingList(guid);
    await dispatch(setMailingActions(mailingList));
  }
};

export const save = async (model) => {
  if (model.guid) {
    await mailingService.updateMailingList(model.guid, model);
  } else {
    await mailingService.createMailingList(model);
  }
};
