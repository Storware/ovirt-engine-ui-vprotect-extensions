import { policiesService } from '../services/policies-service';

export class AutoAssignSettings {
  mode = policiesService.assignModes[0];
  includeTags = [];
  excludeTags = [];
  includeRegExps = [];
  excludeRegExps = [];
  hvClusters = [];
}
