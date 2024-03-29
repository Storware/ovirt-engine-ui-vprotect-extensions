import { MountedFileSystemRequest } from './mounted-file-system-request';
import { NameAndGuid } from '../dto/nameAndGuid';
import { BackupLocation } from 'model/tasks/backup-location.model';
import moment from 'moment-timezone';
import { getUnmountPeriodForMountedBackups } from 'utils/user';

export class RestoreAndMountTask {
  backupLocation: BackupLocation;
  mode: any;
  node: NameAndGuid;
  mountedFileSystems: MountedFileSystemRequest[] = [];
  mountedDisks: any[];
  allowedClients: string[] = [];
  unmountTime = getUnmountPeriodForMountedBackups() * 1000 * 60 * 60;
}
