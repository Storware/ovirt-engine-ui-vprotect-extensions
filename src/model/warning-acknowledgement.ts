import { NameAndGuid } from './dto/nameAndGuid';

export interface WarningAcknowledgementRequest {
  protectedEntities: NameAndGuid[];
  backups: NameAndGuid[];
  snapshots: NameAndGuid[];
  restoreJobs: NameAndGuid[];
  backupDestinations: NameAndGuid[];
}
