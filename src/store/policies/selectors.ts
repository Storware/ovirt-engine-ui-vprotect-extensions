import { RootState } from '../index';

export const selectPolicies = (store: RootState) => store.policies.policies;
