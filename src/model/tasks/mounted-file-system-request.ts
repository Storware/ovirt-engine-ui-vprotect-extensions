import { NameAndGuid } from '../dto/nameAndGuid';

export class MountedFileSystemRequest {
  fileSystem?: NameAndGuid;
  mountPath: string;
  selected? = false;
}
