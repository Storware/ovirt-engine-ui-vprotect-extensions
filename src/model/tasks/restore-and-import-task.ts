import { BaseImage } from '../base-image';
import { DataCenter } from '../data-center';
import { NameAndDescription } from '../dto/nameAndDescription';

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
  dataCenter = new DataCenter();
  restoredDiskAllocationFormat: NameAndDescription = { name: 'PREALLOCATED', description: 'Preallocated' };
  overwrite = false;
}
