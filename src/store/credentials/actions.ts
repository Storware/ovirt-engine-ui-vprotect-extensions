import { Dispatch } from 'redux';
import {
  CredentialsAction,
  SET_CREDENTIALS,
  SET_SELECTED_CREDENTIAL,
} from './types';
import { credentialsService } from '../../services/credensial-service';
import { CredentialModel } from '../../model';
import { Optional } from '../../model/utils';

export const setCredentials = (
  payload: CredentialModel[],
): CredentialsAction => ({
  type: SET_CREDENTIALS,
  payload,
});

export const setSelectedCredential = (
  payload: CredentialModel,
): CredentialsAction => ({
  type: SET_SELECTED_CREDENTIAL,
  payload,
});

export const getCredentials = async (dispatch: Dispatch) => {
  const credentials = await credentialsService.getCredentials();
  await dispatch(setCredentials(credentials));
};

export const getCredential = (guid: string) => async (dispatch: Dispatch) => {
  if (!guid) {
    return;
  }

  const credential = await credentialsService.getCredential(guid);
  await dispatch(setSelectedCredential(credential));
};

export const saveCredential = async (
  credential: Optional<CredentialModel, 'guid'>,
) => {
  !!credential.guid
    ? await credentialsService.updateCredential(credential as CredentialModel)
    : await credentialsService.createCredential(credential);
};
