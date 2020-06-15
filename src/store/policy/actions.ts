import {Dispatch} from 'redux';
import {SET_BACKUP_DESTINATIONS, SET_VIRTUAL_MACHINES, SET_HYPERVISOR_CLUSTERS, SET_POLICY, PolicyAction, SET_SCHEDULES} from './types';
import {policiesService} from '../../components/vprotect/services/policies-service'
import {hypervisorsService} from '../../components/vprotect/services/hypervisors-service'
import {virtualMachinesService} from '../../components/vprotect/services/virtual-machines-service'
import {backupDestinationsService} from '../../components/vprotect/services/backup-destinations-service'
import {schedulesService} from '../../components/vprotect/services/schedules-service'
import {alertService} from '../../components/vprotect/services/alert-service'


export const setPolicyAction = (payload: any): PolicyAction => {
    return {
        type: SET_POLICY,
        payload
    };
};

export const setHypervisorClustersAction = (payload: any): PolicyAction => {
    return {
        type: SET_HYPERVISOR_CLUSTERS,
        payload
    };
};

export const setVirtualMachinesAction = (payload: any[]): PolicyAction => {
    return {
        type: SET_VIRTUAL_MACHINES,
        payload
    };
};

export const setBackupDestinationsAction = (payload: any[]): PolicyAction => {
    return {
        type: SET_BACKUP_DESTINATIONS,
        payload
    };
};

export const setSchedules = (payload: any[]): PolicyAction => {
    return {
        type: SET_SCHEDULES,
        payload
    };
};


export const getPolicyPage = (type: string, guid: string) => async (dispatch: Dispatch) => {
    if (guid !== 'create') {
        const policy = await policiesService.getPolicy(type, guid)
        await dispatch(setPolicyAction(policy))
    }
    const hypervisorClusters = await hypervisorsService.getAllHypervisorClusters()
    await dispatch(setHypervisorClustersAction(hypervisorClusters))
    const virtualMachines = await virtualMachinesService.getVirtualMachines()
    await dispatch(setVirtualMachinesAction(virtualMachines))
    const backupDestinations = await backupDestinationsService.getAllBackupDestinations()
    await dispatch(setBackupDestinationsAction(backupDestinations))
    const schedueles = await schedulesService.getAllTypeSchedules('SNAPSHOT')
    await dispatch(setSchedules(schedueles))
};

export const save = async (model) => {
    if (model.guid) {
        await policiesService.updatePolicy('snapshot', model.guid, model)
        await policiesService.updateRule('snapshot', model.rules[0].guid, model.rules[0])
        alertService.info('Policy updated')
    } else {
        const policy = await policiesService.createPolicy('snapshot', model)
        await policiesService.createRule('snapshot', {
            ...model.rules[0],
            name: 'Default',
            policy: {
                guid: policy.guid
            }
        })
        alertService.info('Policy created')
    }
}
