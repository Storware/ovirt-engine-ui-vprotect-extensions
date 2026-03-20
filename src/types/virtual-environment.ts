export type VirtualEnvironment = {
  averageProgress: number;
  backupUpToDate: boolean;
  guid: string;
  hvCluster: {
    guid: string;
    name: string;
  };
  hvManager: {
    guid: string;
    name: string;
  };
  hvType: {
    name: string;
    description: string;
  };
  hvmType: {
    name: string;
    description: string;
  };
  hypervisor: {
    guid: string;
    name: string;
    hvManager: {
      guid: string;
    };
  };
  lastBackup: number;
  lastChainMarkedForDeletion: boolean;
  lastSuccessfulBackupSize: number;
  lastSuccessfulFullBackup: string;
  lastSuccessfulFullBackupSize: number;
  lastSuccessfulIncBackup: string;
  name: string;
  networks: {
    guid: string;
    name: string;
  }[];
  originalName: string;
  possibleActions: {
    name: string;
    description: string;
  }[];
  present: boolean;
  project: {
    guid: string;
    name: string;
  };
  restorable: boolean;
  restoreStatus: string;
  supportsQuiesceSnapshot: boolean;
  type: {
    name: string;
    description: string;
  };
  uuid: string;
  virtualProvider: {
    guid: string;
    name: string;
    virtualProviderType: {
      name: string;
      description: string;
    };
  };
  vmBackupPolicy: {
    guid: string;
    name: string;
  };
  vmFlavor: {
    guid: string;
    name: string;
  };
  warningsPresent: boolean;
};
