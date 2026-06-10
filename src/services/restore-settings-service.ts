import { vprotectApiService } from './vprotect-api-service';

export const restoreSettingsService = {
  fetchRestoreSettings: ({
    hvmGuid,
    backupGuid,
    clusterGuid,
  }: {
    hvmGuid: string;
    backupGuid: string;
    clusterGuid: string;
  }): Promise<RestoreSettingsDTO> =>
    vprotectApiService.get('/openstack/restore-settings/project-restriction', {
      params: {
        'hvm-guid': hvmGuid,
        'backup-guid': backupGuid,
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
