import { NameAndGuid } from './dto/nameAndGuid';
import { NameAndDescription } from 'model/dto/nameAndDescription';

export interface FileWithConfigModel {
  backup: NameAndGuid;
  backupTime: number;
  encryption: number;
  format: NameAndDescription;
  guid: string;
  iscsiMountable: boolean;
  mountable: boolean;
  path: string;
  restoresTime: number[];
  size: number;
  config?: string;
  configPresent?: boolean;
  vmDisk: NameAndGuid;
}
