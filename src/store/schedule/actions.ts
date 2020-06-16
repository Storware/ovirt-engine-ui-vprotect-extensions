import {Dispatch} from 'redux';
import {SET_POLICIES, SET_SCHEDULE, PolicyAction} from './types';
import {policiesService} from '../../components/vprotect/services/policies-service'
import {schedulesService} from '../../components/vprotect/services/schedules-service'
import {alertService} from '../../components/vprotect/services/alert-service'
import {Schedule} from '../../components/vprotect/model/schedule';

export const setScheduleAction = (payload: any): PolicyAction => {
    return {
        type: SET_SCHEDULE,
        payload
    };
};

export const setPoliciesAction = (payload: any): PolicyAction => {
    return {
        type: SET_POLICIES,
        payload
    };
};

const policyType = {
    'SNAPSHOT': 'snapshot',
    'VM_BACKUP': 'vm-backup',
}

export const getSchedulePage = (type: string, guid: string) => async (dispatch: Dispatch) => {
    const scheduele = guid === 'create' ? new Schedule(type) : await schedulesService.getSchedule(guid)
    await dispatch(setScheduleAction(scheduele))
    const policies = await policiesService.getPolicies(policyType[type])
    await dispatch(setPoliciesAction(policies))
};

export const save = async (model: any) => {
    if (model.guid) {
        await schedulesService.updateSchedule(model.guid, model)
        alertService.info('Schedule updated')
    } else {
        await schedulesService.createSchedule(model)
        alertService.info('Schedule created')
    }
}
