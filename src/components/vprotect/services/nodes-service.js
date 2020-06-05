import {vprotectApiService} from './vprotect-api-service'

class NodesService {
  getAllNodes () {
    return vprotectApiService.get('/nodes')
  }
}

export const nodesService = new NodesService()
