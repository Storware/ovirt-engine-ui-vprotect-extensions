import { RootState } from '../index';

export const selectPolicies = (store: RootState) => store.policies.policies;
export const selectFilteredPolicies = (store: RootState) =>
  store.policies.filteredPolicies;
