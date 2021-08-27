import {
    BackupModalAction,
    SET_BACKUPS,
    SET_FILTERED_HYPERVISOR_STORAGES,
    SET_HYPERVISOR_CLUSTERS,
    SET_HYPERVISOR_MANAGERS,
    SET_HYPERVISOR_STORAGES,
    SET_PROJECTS_FOR_HYPERVISOR_MANAGER,
    SET_TASK,
} from './types';
import {Dispatch} from 'redux';
import {backupsService} from '../../services/backups-service';
import {alertService} from '../../services/alert-service';
import {tasksService} from '../../services/tasks-service';
import {hypervisorsService} from '../../services/hypervisors-service';
import {vprotectService} from '../../services/vprotect-service';
import {hideModalAction, unsaveModalAction} from '../modal/actions';
import {RestoreAndImportTask} from '../../model/tasks/restore-and-import-task';

export const setTaskAction = (payload: any): BackupModalAction => {
    return {
        type: SET_TASK,
        payload,
    };
};

export const setBackupsAction = (payload: any[]): BackupModalAction => {
    return {
        type: SET_BACKUPS,
        payload,
    };
};

export const setHypervisoManagersAction = (payload: any[]): BackupModalAction => {
    return {
        type: SET_HYPERVISOR_MANAGERS,
        payload,
    };
};

export const setHypervisorStoragesAction = (payload: any[]): BackupModalAction => {
    return {
        type: SET_HYPERVISOR_STORAGES,
        payload,
    };
};

export const setFilteredHypervisorStoragesAction = (payload: any[]): BackupModalAction => {
    return {
        type: SET_FILTERED_HYPERVISOR_STORAGES,
        payload,
    };
};

export const setHypervisorClustersAction = (payload: any[]): BackupModalAction => {
    return {
        type: SET_HYPERVISOR_CLUSTERS,
        payload,
    };
};

export const setProjectsForHypervisorManager = (payload: any[]): BackupModalAction => {
    return {
        type: SET_PROJECTS_FOR_HYPERVISOR_MANAGER,
        payload,
    };
};

export const getRestorableBackups = (virtualMachine: any) => async (dispatch: Dispatch) => {
    const backups = await backupsService.getRestorableBackups(virtualMachine.guid);
    await dispatch(setBackupsAction(backups));
};

const hypervisorFromArray = (hypervisor, hypervisors) => {
    return !!hypervisors && hypervisors.length > 0 && hypervisors.find((el) => el.guid === hypervisor.guid)
}

export const getHypervisorManagersAvailableForBackup = (
    backupGuid: any,
    virtualMachine: any,
    task: RestoreAndImportTask
) => async (dispatch: Dispatch) => {
    const hypervisorManagers = await backupsService.getHypervisorManagersAvailableForBackup(backupGuid);
    if (hypervisorManagers.length === 0) {
        return
    }
    await dispatch(setHypervisoManagersAction(hypervisorManagers));
    const hypervisorInArray = hypervisorFromArray(virtualMachine.hvManager, hypervisorManagers)
    const hypervisorManager = hypervisorInArray || hypervisorManagers[0]
    await dispatch(setTaskAction({
        ...task,
        hypervisorManager
    }))

    const hypervisorClusters = await hypervisorsService.getHypervisorClustersForHvm(hypervisorManager.guid);
    await dispatch(setHypervisorClustersAction(hypervisorClusters));

    const hypervisorStorages = await hypervisorsService.getHypervisorStoragesForHvm(hypervisorManager.guid);
    await dispatch(setHypervisorStoragesAction(hypervisorStorages));
};

export const getHypervisorStoragesForHypervisorManager = (hypervisorManagerGuid: string) => async (dispatch: Dispatch) => {
    const hypervisorStorages = await hypervisorsService.getHypervisorStoragesForHvm(hypervisorManagerGuid);
    await dispatch(setHypervisorStoragesAction(hypervisorStorages));
};

export const getHypervisorClustersForHypervisorManager = (hypervisorManagerGuid: string) => async (dispatch: Dispatch) => {
    const hypervisorClusters = await hypervisorsService.getHypervisorClustersForHvm(hypervisorManagerGuid);
    await dispatch(setHypervisorClustersAction(hypervisorClusters));
};

export const getProjectsForHypervisorManager = (hypervisorManagerGuid: string) => async (dispatch: Dispatch) => {
    const projectsForHypervisorManager = await vprotectService.getProjectsForHypervisorManager(hypervisorManagerGuid);
    await dispatch(setProjectsForHypervisorManager(projectsForHypervisorManager));
}

export const submitTask = (task) => async (dispatch: Dispatch) => {
    try {
        await tasksService.submitTaskRestoreAndImport(task);
        alertService.info('Restore task has been submitted');
        await dispatch(hideModalAction());
    } catch (e) {
        await dispatch(unsaveModalAction());
    }
};
