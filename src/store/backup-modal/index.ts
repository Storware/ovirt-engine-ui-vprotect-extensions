import {
  BackupModalAction,
  SET_BACKUP_DESTINATIONS,
  SET_BACKUP_TYPES,
  SET_IS_SELECTED_RULES_ZERO,
} from './types';

export type PoliciesStore = {
  readonly backupTypes: any[];
  readonly backupDestinations: any[];
  readonly isSelectedRulesZero: boolean;
};

const initial: PoliciesStore = {
  backupTypes: [],
  backupDestinations: [],
  isSelectedRulesZero: false,
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
  if (action.type === SET_IS_SELECTED_RULES_ZERO) {
    return {
      ...state,
      isSelectedRulesZero: action.payload,
    };
  }

  return state;
};
