import {PoliciesAction, SET_FILTERED_SCHEDULES, SET_SCHEDULES} from './types';
import {Dispatch} from 'redux';
import {alertService} from '../../components/vprotect/services/alert-service';
import {schedulesService} from '../../components/vprotect/services/schedules-service';

export const setSchedules = (payload: any[]): PoliciesAction => {
    return {
        type: SET_SCHEDULES,
        payload
    };
};

export const setFilteredSchedules = (payload: any[]): PoliciesAction => {
    return {
        type: SET_FILTERED_SCHEDULES,
        payload
    };
};

export const getSchedules = (type: string) => async (dispatch: Dispatch) => {
    const schedules = await schedulesService.getAllTypeSchedules(type)
    await dispatch(setSchedules(schedules))
}

export const removeSchedule = (type: string, guid: string) => async (dispatch: Dispatch) => {
    await schedulesService.getAllTypeSchedules(guid)
    const schedules = await schedulesService.getAllTypeSchedules(type)
    await dispatch(setSchedules(schedules))
    alertService.info('Schedule removed')
}
