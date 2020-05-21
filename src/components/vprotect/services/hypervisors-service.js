import {vprotectApiService} from './vprotect-api-service'

class HypervisorsService {
  getAllHypervisorManagers () {
    return vprotectApiService.get(`/hypervisor-managers`)
  }

  getAllHypervisorClusters () {
    return vprotectApiService.get('/hypervisor-clusters')
  }

  getHypervisor (id) {
    return vprotectApiService.get('/hypervisors/' + id)
  }
}

export const hypervisorsService = new HypervisorsService()
