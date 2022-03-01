import { NameAndDescription } from './dto/nameAndDescription';
import { NameAndGuid } from './dto/nameAndGuid';

export class AutoAssignSettings {
  mode: NameAndDescription<string>;
  includeTags: string[] = [];
  excludeTags: string[] = [];
  includeRegExps: string[] = [];
  excludeRegExps: string[] = [];
  hvClusters: NameAndGuid[] = [];
}
