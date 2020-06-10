import { MountedFileSystemRequest } from './mounted-file-system-request';
import {NameAndGuid} from '../dto/nameAndGuid';

export class RestoreAndMountTask {
  backup: NameAndGuid | any;
  mode: any;
  node: NameAndGuid;
  mountedFileSystems: MountedFileSystemRequest[] = [];
  mountedDisks: any[];
  allowedClients: string[] = []
}
