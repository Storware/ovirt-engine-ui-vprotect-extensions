import { MountedFileSystemRequest } from './mounted-file-system-request';
import { NameAndGuid } from '../dto/nameAndGuid';
import { BackupLocation } from 'model/tasks/backup-location.model';
import moment from 'moment-timezone';

export class RestoreAndMountTask {
  backupLocation: BackupLocation;
  mode: any;
  node: NameAndGuid;
  mountedFileSystems: MountedFileSystemRequest[] = [];
  mountedDisks: any[];
  allowedClients: string[] = [];
  unmountTime = moment().add(24, 'hours').valueOf();
}
