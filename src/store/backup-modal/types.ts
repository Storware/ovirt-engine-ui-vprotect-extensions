export const SET_BACKUP_DESTINATIONS = 'SET_BACKUP_DESTINATIONS';
export const SET_BACKUP_TYPES = 'SET_BACKUP_TYPES';
export const SET_IS_SELECTED_RULES_ZERO = 'SET_IS_SELECTED_RULES_ZERO';

export type SetBackupDestinations = {
  type: typeof SET_BACKUP_DESTINATIONS;
  payload?: any;
};

export type SetBackupTypes = {
  type: typeof SET_BACKUP_TYPES;
  payload?: any;
};

export type SetIsSelectedRulesZero = {
  type: typeof SET_IS_SELECTED_RULES_ZERO;
  payload?: boolean;
};

export type BackupModalAction =
  | SetBackupDestinations
  | SetBackupTypes
  | SetIsSelectedRulesZero;
