import { vprotectApiService } from './vprotect-api-service';

export const restoreSettingsService = {
  fetchRestoreSettings: ({
    hvmGuid,
    backupGuid,
    projectGuid,
    clusterGuid,
  }: {
    hvmGuid: string;
    backupGuid: string;
    projectGuid?: string; // For development purposes - to be removed when project guid will be added to the URL in the backend
    clusterGuid: string;
  }): Promise<RestoreSettingsDTO> =>
    vprotectApiService.get('/openstack/restore-settings', {
      params: {
        'hvm-guid': hvmGuid,
        'backup-guid': backupGuid,
        'project-guid': projectGuid,
        'cluster-guid': clusterGuid,
      },
    }) as Promise<RestoreSettingsDTO>,
};

type NameGuidUuidDTO = {
  guid: string;
  name: string;
  uuid: string;
};

type SourceNetworkWithSecurityGroupsDTO = {
  guid: string;
  uuid: string;
  name: string;
  defaultMacAddress: string;
  defaultNetworkInternalId: string;
  securityGroupsFromBackup: NameGuidUuidDTO[];
};

type TargetNetworkDTO = NameGuidUuidDTO;

type RestoreSettingsDTO = {
  networkSection?: {
    securityGroupsFromHypervisorManager: NameGuidUuidDTO[];
    sourceNetworkWithSecurityGroups: SourceNetworkWithSecurityGroupsDTO[];
    targetNetworks: TargetNetworkDTO[];
  };
  storageSection?: undefined;
  advancedSection?: undefined;
};
