import {vprotectApiService} from './vprotect-api-service'

class VirtualMachinesService {
  getVirtualMachines () {
    return vprotectApiService.get(`/virtual-machines?hypervisor-manager-type`)
  }

  getVirtualMachine (id) {
    return vprotectApiService.get('/virtual-machines/' + id)
  }

  getVirtualMachineSnapshots (id) {
    return vprotectApiService.get('/snapshots?protected-entity=' + id)
  }
}

export const virtualMachinesService = new VirtualMachinesService()
