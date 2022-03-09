import {
  CredentialsAction,
  SET_CREDENTIALS,
  SET_SELECTED_CREDENTIAL,
} from './types';
import { CredentialModel } from '../../model';

export type CredentialsStore = {
  readonly credentials: CredentialModel[];
  readonly selectedCredential: CredentialModel | null;
};

const initial: CredentialsStore = {
  credentials: [],
  selectedCredential: null,
};

export default (state = initial, action: CredentialsAction) => {
  if (action.type === SET_CREDENTIALS) {
    return {
      ...state,
      credentials: action.payload,
    };
  }

  if (action.type === SET_SELECTED_CREDENTIAL) {
    return {
      ...state,
      selectedCredential: action.payload,
    };
  }
  return state;
};
