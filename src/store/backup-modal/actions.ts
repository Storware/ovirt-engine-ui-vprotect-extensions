import {BackupModalAction, SET_BACKUP_DESTINATIONS, SET_BACKUP_TYPES, SET_TASK} from './types';
import {Dispatch} from 'redux';
import {backupDestinationsService} from '../../components/vprotect/services/backup-destinations-service';
import {vprotectService} from '../../components/vprotect/services/vprotect-service';
import {alertService} from '../../components/vprotect/services/alert-service';
import {BackupTask} from '../../components/vprotect/model/tasks/backup-task';
import {hideModal, unsaveModal} from '../modal/actions';

export const setTaskAction = (payload: any): BackupModalAction => {
    return {
        type: SET_TASK,
        payload
    };
};

export const setBackupDestinationsAction = (payload: any[]): BackupModalAction => {
    return {
        type: SET_BACKUP_DESTINATIONS,
        payload
    };
};

export const setBackupTypesAction = (payload: any[]): BackupModalAction => {
    return {
        type: SET_BACKUP_TYPES,
        payload
    };
};

export const getBackupDestinationsAndBackupTypes = (virtualEnvironments: any) => async (dispatch: Dispatch) => {
    const backupDestiantions = await backupDestinationsService.getBackupDestinationsForVMs(virtualEnvironments)
    await dispatch(setBackupDestinationsAction(backupDestiantions))
    const backupTypes = vprotectService.getBackupTypes(virtualEnvironments[0])
    await dispatch(setBackupTypesAction(backupTypes))
    const task = new BackupTask();
    task.backupType = backupTypes[0]
    task.backupDestination = backupDestiantions[0]
    task.protectedEntities = virtualEnvironments
    await dispatch(setTaskAction(task))
};

export const submitTask = (task: BackupTask) => async (dispatch: Dispatch) => {
    try {
        await vprotectService.submitExportTask(task)
        alertService.info('Backup task has been submitted')
        await dispatch(hideModal())
    } catch (e) {
        await dispatch(unsaveModal())
    }
}
