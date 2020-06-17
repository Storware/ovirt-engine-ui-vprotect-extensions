import {
  BackupModalAction,
  SET_BACKUP_DESTINATIONS,
  SET_BACKUP_TYPES,
} from './types';

export type PoliciesStore = {
  readonly backupTypes: any[];
  readonly backupDestinations: any[];
};

const initial: PoliciesStore = {
  backupTypes: [],
  backupDestinations: [],
};

export default (state = initial, action: BackupModalAction) => {
  if (action.type === SET_BACKUP_DESTINATIONS) {
    return {
      ...state,
      backupDestinations: action.payload,
    };
  }
  if (action.type === SET_BACKUP_TYPES) {
    return {
      ...state,
      backupTypes: action.payload,
    };
  }

  return state;
};
