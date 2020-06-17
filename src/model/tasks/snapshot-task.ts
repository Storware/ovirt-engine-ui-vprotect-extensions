import { NameAndGuid } from '../dto/nameAndGuid';

export class SnapshotTask {
  priority = 50;
  protectedEntities: NameAndGuid[];
  rule: NameAndGuid;
}
