import { SortDirection } from 'model';

export interface SortTypes {
  orderBy: string;
  direction: SortDirection;
}

export const enum DataNameToFieldName {
  State = 'state.name',
  Type = 'definitionName',
  Step = 'currentStep',
  Instance = 'protectedEntity.name',
  OriginEntity = 'originEntity',
  Priority = 'priority',
}

export const DataNameSets: { [key in DataNameToFieldName]: string } = {
  [DataNameToFieldName.State]: 'state',
  [DataNameToFieldName.Type]: 'type',
  [DataNameToFieldName.Step]: 'step',
  [DataNameToFieldName.Instance]: 'instance',
  [DataNameToFieldName.OriginEntity]: 'originEntity',
  [DataNameToFieldName.Priority]: 'priority',
};

export interface GetWorkflowExecutionObject {
  page: number;
  size: number;
  orderBy: string;
  direction: SortDirection;
  filter: string;
}
