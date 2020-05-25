import {SET_SNAPSHOTS, VirtualMachineAction} from './types';
import {Dispatch} from 'redux';
import {SET_RESTORES_HISTORY, SET_BACKUPS_HISTORY, SET_HYPERVISOR, SET_VIRTUAL_MACHINE} from './types';
import {virtualMachinesService} from '../../components/vprotect/services/virtual-machines.service';
import {hypervisorsService} from '../../components/vprotect/services/hypervisors-service';
import {backupsService} from '../../components/vprotect/services/backups-service';

export const setVirtualMachine = (payload: any): VirtualMachineAction => {
    return {
        type: SET_VIRTUAL_MACHINE,
        payload
    };
};

export const setHypervisor = (payload: any): VirtualMachineAction => {
    return {
        type: SET_HYPERVISOR,
        payload
    };
};

export const setBackupsHistory = (payload: any[]): VirtualMachineAction => {
    return {
        type: SET_BACKUPS_HISTORY,
        payload
    };
};

export const setRestoresHistory = (payload: any[]): VirtualMachineAction => {
    return {
        type: SET_RESTORES_HISTORY,
        payload
    };
};

export const setSnapshots = (payload: any[]): VirtualMachineAction => {
    return {
        type: SET_SNAPSHOTS,
        payload
    };
};

export const getVirtualMachinePage = (guid) => async (dispatch: Dispatch) => {
    if (!guid) {
        return;
    }
    const virtualMachine = await virtualMachinesService.getVirtualMachine(guid)
    await dispatch(setVirtualMachine(virtualMachine));
    const hypervisor = await hypervisorsService.getHypervisor(virtualMachine.hypervisor.guid)
    await dispatch(setHypervisor(hypervisor));
    const backupsHistory = await backupsService.getProtectedEntityBackups(guid)
    await dispatch(setBackupsHistory(backupsHistory));
    const restoresHistory = await backupsService.getProtectedEntityRestoreJobs(guid)
    await dispatch(setRestoresHistory(restoresHistory));
    let snapshots = await virtualMachinesService.getVirtualMachineSnapshots(guid)
    snapshots = setCurrentForIncrementalBackup(virtualMachine, snapshots)
    await dispatch(setSnapshots(snapshots));
};

const setCurrentForIncrementalBackup = (virtualMachine, snapshots) => {
    for (const snapshot of snapshots) {
        if (virtualMachine.lastStoredSnapshot != null
            && snapshot.guid === virtualMachine.lastStoredSnapshot.guid) {
            snapshot.current = true;
            break;
        }
    }
    return snapshots;
}
