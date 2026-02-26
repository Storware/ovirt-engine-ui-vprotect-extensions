import { Dispatch } from 'redux';
import { credentialsService } from '../../services/credensial-service';
import {
  CredentialsAction,
  SET_CREDENTIALS,
  SET_SELECTED_CREDENTIAL,
} from './types';
import { CredentialModel } from '@/model/CredentialModel';

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

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export const saveCredential = async (
  credential: Optional<CredentialModel, 'guid'>,
) => {
  credential.guid
    ? await credentialsService.updateCredential(credential as CredentialModel)
    : await credentialsService.createCredential(credential);
};
