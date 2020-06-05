import {MountBackupModalAction, SET_MOUNTABLE_BACKUPS, SET_NODES, SET_TASK} from './types';
import {Dispatch} from 'redux';
import {backupsService} from '../../components/vprotect/services/backups-service';
import {vprotectService} from '../../components/vprotect/services/vprotect-service';
import {alertService} from '../../components/vprotect/services/alert-service';
import {nodesService} from '../../components/vprotect/services/nodes-service';
import {BackupTask} from '../../components/vprotect/model/tasks/backup-task';
import {hideModalAction, unsaveModalAction} from '../modal/actions';

export const setTaskAction = (payload: any): MountBackupModalAction => {
    return {
        type: SET_TASK,
        payload
    };
};

export const setMountableBackupsAction = (payload: any[]): MountBackupModalAction => {
    return {
        type: SET_MOUNTABLE_BACKUPS,
        payload
    };
};

export const setNodesAction = (payload: any[]): MountBackupModalAction => {
    return {
        type: SET_NODES,
        payload
    };
};

export const getMountedBackup = (guid: string) => async (dispatch: Dispatch) => {
    const mountableBackups = await backupsService.getMountableBackups(guid)
    await dispatch(setMountableBackupsAction(mountableBackups))
    const nodes = await nodesService.getAllNodes()
    await dispatch(setNodesAction(nodes))



};

export const submitTask = (task: BackupTask) => async (dispatch: Dispatch) => {
    try {
        await vprotectService.submitExportTask(task)
        alertService.info('Backup task has been submitted')
        await dispatch(hideModalAction())
    } catch (e) {
        await dispatch(unsaveModalAction())
    }
}
