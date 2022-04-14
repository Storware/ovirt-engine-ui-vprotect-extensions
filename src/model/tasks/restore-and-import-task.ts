import { BaseImage } from '../base-image';
import { DataCenter } from '../data-center';
import { NameAndDescription } from '../dto/nameAndDescription';
import { RestoredNetwork } from 'model/tasks/restored-network';
import { NetworkInterfaceCard } from 'model/tasks/network-interface-card';

export class RestoreAndImportTask {
  restoreStorageId = '';
  restoreClusterId = '';
  backup: any = null;
  hypervisor: any;
  hypervisorManager: any = null;
  restoredPeName = '';
  restoreProject: string;
  taskFiles: any[] = [];
  baseImage = new BaseImage();
  dataCenter: DataCenter;
  restoredDiskAllocationFormat: NameAndDescription<string> = {
    name: 'PREALLOCATED',
    description: 'Preallocated',
  };
  overwrite = false;
  restoreToOriginalVolumeType: boolean;
  readonly restoredNetworks: RestoredNetwork[];
  constructor(networkInterfaceCards?: NetworkInterfaceCard[]) {
    this.restoredNetworks =
      networkInterfaceCards?.map((network) => new RestoredNetwork(network)) ??
      [];
  }
}
