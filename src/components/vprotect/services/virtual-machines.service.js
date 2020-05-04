import {vprotectApiService} from './vprotect-api-service'

class VirtualMachinesService {
  getVirtualMachines () {
    return vprotectApiService.get(`/virtual-machines?hypervisor-manager-type=RHV`)
  }
}

export const virtualMachinesService = new VirtualMachinesService()
