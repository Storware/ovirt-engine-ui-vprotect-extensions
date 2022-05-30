import {NameAndDescription} from '../dto/nameAndDescription';
import {BackupDestinationType} from './backup-destination-type';

export class BackupDestination {
  guid: string;
  name: string;
  nodeConfigs = [];
  totalUsedSpace: number;
  totalAvailableSpace: number;
  totalDedupUsedSpace: number;
  totalDedupAvailableSpace: number;
  defaultBackupDestination = false;
  description: string;
  projects = [];
  visibleForAllVms = true;
  type: NameAndDescription<BackupDestinationType>;
}
