export const SET_POLICIES = 'SET_POLICIES';
export const SET_FILTERED_POLICIES = 'SET_FILTERED_POLICIES';

export type SetPoliciesAction = {
    type: typeof SET_POLICIES;
    payload?: any[];
};

export type SetFilteredPoliciesAction = {
    type: typeof SET_FILTERED_POLICIES;
    payload?: any[];
};

export type PoliciesAction =
    SetPoliciesAction |
    SetFilteredPoliciesAction;
