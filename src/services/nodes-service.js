import { vprotectApiService } from './vprotect-api-service';

class NodesService {
  getAllNodeConfigurations() {
    return vprotectApiService.get('/node-configs');
  }
}

export const nodesService = new NodesService();
