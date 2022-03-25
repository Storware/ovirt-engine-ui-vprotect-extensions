import { MountedFileSystemRequest } from './mounted-file-system-request';
import { NameAndGuid } from '../dto/nameAndGuid';
import { BackupLocation } from 'model/tasks/backup-location.model';

export class RestoreAndMountTask {
  backupLocation: BackupLocation;
  mode: any;
  node: NameAndGuid;
  mountedFileSystems: MountedFileSystemRequest[] = [];
  mountedDisks: any[];
  allowedClients: string[] = [];
}
