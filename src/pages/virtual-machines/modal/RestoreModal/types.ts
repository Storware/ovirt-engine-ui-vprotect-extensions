import type { VirtualEnvironment } from 'types/virtual-environment';
import { FormikConfig, FormikProps } from 'formik';
import { AccordionActiveIndexType } from 'primereact/accordion';

export interface RestoreModalContextType {
  formRef: React.MutableRefObject<FormikProps<RestoreModalForm>>;
  backupLocations: BackupLocation[];
  hypervisorManagers: any[];
  flavors: any[];
  task: any;
  clusters: any[];
  filteredStorages: any[];
  virtualEnvironment: VirtualEnvironment;
  formInitialValue: any;
  loadingNetworkSettings: boolean;
  networkSettings: null | NetworkSettings;
  visibleTabs: AccordionActiveIndexType;

  onBackupLocationChange: (value: BackupLocation) => void;
  onHypervisorChange: (value: any) => void;
  onClusterChange: (value: any) => void;
  submitForm: FormikConfig<RestoreModalForm>['onSubmit'];
  hideModal: () => void;
  saveModal: () => void;
  setVisibleTabs: (i: AccordionActiveIndexType) => void;
}

export type RestoreModalForm = {
  backupLocation: BackupLocation | null;
  hypervisorManager: any | null;
  restoreClusterId: string | null;
  taskFiles: {
    backupFile: {
      guid: string;
    };
    originalDiskName: string;
    originalDiskGuid: string;
    diskName: string;
    path: string;
    excludedFromRestore: boolean;
    storageId: string;
  }[];
  restoredNetworks: {
    guid: string;
    name: string;
    networkGuid: string;
    securityGroupGuids: string[];
    macAddress: string | null;
    macAddressSpecified: boolean;
  }[];
  restoredPeName: string;
  overwrite: boolean;
  restoreToOriginalVolumeType: any;
  isFlavorSectionActive: boolean;
  restoreVmFlavor: any;
};

export type NetworkSettings = {
  securityGroupsFromHypervisorManager: {
    guid: string;
    name: string;
    uuid: string;
  }[];
  sourceNetworkWithSecurityGroups: {
    guid: string;
    uuid: string;
    name: string;
    defaultMacAddress: string;
    defaultNetworkInternalId: string;
    securityGroupsFromBackup: {
      guid: string;
      name: string;
      uuid: string;
    }[];
  }[];
  targetNetworks: {
    guid: string;
    name: string;
    uuid: string;
  }[];
};

export interface RestoreAndImportTaskRequestDTO {
  backup: { guid?: string };
  backupLocation: { guid?: string };
  baseImage?: any;
  hypervisorManager?: { guid?: string } | null;
  overwrite?: boolean;
  restoreClusterId?: string;
  restoreStorageId?: string;
  restoreToOriginalVolumeType?: boolean;
  restoreVmFlavor?: { guid?: string };
  restoredDiskAllocationFormat?: {
    description: string;
    name: string;
  };
  restoredNetworks?: RestoredNetworkDTO[];
  restoredPeName?: string;
  taskFiles?: {
    backupFile?: {
      guid: string;
    };
    path?: string;
    config?: string;
    storageId?: string;
    markedForRestore?: boolean;
    originalDiskGuid?: string;
    diskName?: string;
    excludedFromRestore?: boolean;
  }[];
}

interface RestoredNetworkDTO {
  network: {
    guid: string;
  };
  networkInterfaceCard: {
    name: string;
  };
  macAddress?: string;
  macAddressSpecified?: boolean;
  securityGroups?: string[];
}

export type BackupLocation = {
  guid: string;
  name: string;
  backup: {
    guid: string;
    name: string;
  };
  backupDestination: {
    guid: string;
    name: string;
  };
  backupDestinationType: {
    name: string;
    description: string;
  };
  retentionHint: {
    name: string;
    description: string;
  };
  roleType: {
    name: string;
    description: string;
  };
  snapshotTime: number;
  status: {
    name: string;
    description: string;
  };
  type: {
    name: string;
    description: string;
  };
};
