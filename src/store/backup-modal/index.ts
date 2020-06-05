import {
    BackupModalAction, SET_BACKUP_DESTINATIONS, SET_BACKUP_TYPES, SET_TASK
} from './types';
import {BackupTask} from '../../components/vprotect/model/tasks/backup-task';

export type PoliciesStore = {
    readonly backupTypes: any[];
    readonly backupDestinations: any[];
    readonly task: BackupTask
};

const initial: PoliciesStore = {
    backupTypes: [],
    backupDestinations: [],
    task: new BackupTask()
};

export default (state = initial, action: BackupModalAction) => {
    if (action.type === SET_TASK) {
        return {
            ...state,
            task: action.payload,
        };
    }
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
