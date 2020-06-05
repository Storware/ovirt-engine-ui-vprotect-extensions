import {
    MountBackupModalAction, SET_MOUNTABLE_BACKUPS, SET_NODES, SET_TASK
} from './types';
import {BackupTask} from '../../components/vprotect/model/tasks/backup-task';
import {RestoreAndMountTask} from '../../components/vprotect/model/tasks/restore-and-mount-task';

export type MounteBackupStore = {
    readonly task: RestoreAndMountTask
    readonly nodes: any[];
    readonly mountableBackups: any[];
};

const initial: MounteBackupStore = {
    task: new RestoreAndMountTask(),
    nodes: [],
    mountableBackups: []
};

export default (state = initial, action: MountBackupModalAction) => {
    if (action.type === SET_TASK) {
        return {
            ...state,
            task: action.payload,
        };
    }
    if (action.type === SET_MOUNTABLE_BACKUPS) {
        return {
            ...state,
            mountableBackups: action.payload,
        };
    }
    if (action.type === SET_NODES) {
        return {
            ...state,
            nodes: action.payload,
        };
    }

    return state;
};
