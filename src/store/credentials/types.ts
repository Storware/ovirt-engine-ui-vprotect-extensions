import { CredentialModel } from '../../model';

export const SET_CREDENTIALS = 'SET_CREDENTIALS';
export const SET_SELECTED_CREDENTIAL = 'SET_SELECTED_CREDENTIAL';

export type SetCredentialsAction = {
  type: typeof SET_CREDENTIALS;
  payload?: CredentialModel[];
};

export type SetSelectedCredentialAction = {
  type: typeof SET_SELECTED_CREDENTIAL;
  payload?: CredentialModel;
};

export type CredentialsAction =
  | SetCredentialsAction
  | SetSelectedCredentialAction;
