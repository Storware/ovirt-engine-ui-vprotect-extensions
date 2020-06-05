import {PoliciesAction, SET_FILTERED_POLICIES, SET_POLICIES} from './types';
import {Dispatch} from 'redux';
import {alertService} from '../../components/vprotect/services/alert-service';
import {policiesService} from '../../components/vprotect/services/policies-service';

export const setPolicies = (payload: any[]): PoliciesAction => {
    return {
        type: SET_POLICIES,
        payload
    };
};

export const setFilteredPolicies = (payload: any[]): PoliciesAction => {
    return {
        type: SET_FILTERED_POLICIES,
        payload
    };
};

export const getPolicies = (type: string) => async (dispatch: Dispatch) => {
    const policies = await policiesService.getPolicies(type)
    await dispatch(setPolicies(policies))
}

export const removePolicy = (type: string, guid: string) => async (dispatch: Dispatch) => {
    await policiesService.deletePolicy(type, guid)
    alertService.info('Policy removed')
    const policies = await policiesService.getPolicies(type)
    await dispatch(setPolicies(policies))
}
