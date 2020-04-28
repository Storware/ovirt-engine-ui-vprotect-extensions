import {VprotectApiService} from './vprotect-api-service'

export class VprotectService {
  _hvWithIncremental = ['KVM', 'CITRIX', 'ESXI', 'HYPERV'];
  _hvmWithIncremental = ['RHV', 'NUTANIX', 'VCENTER'];

  diskAllocationFormats = [
    {name: 'PREALLOCATED', description: 'Preallocated'},
    {name: 'SPARSE', description: 'Sparse'}
  ];

  vprotectApiService = new VprotectApiService();

  login (username, password) {
    return this.vprotectApiService.post(`/session/login`, {login: username, password: password})
  }

  getDashboardProtectionInfo () {
    return this.vprotectApiService.get(`/dashboard/protection`)
  }

  getDashboardBackupStats (params = {}) {
    const httpOptions = {
      params: params
    }
    return this.vprotectApiService.get('/dashboard/backup-stats', httpOptions)
  }

  getDashboardStagingSpaceInfo () {
    return this.vprotectApiService.get(`/dashboard/staging-space`)
  }

  getDashboardBackupDestinationStats () {
    return this.vprotectApiService.get(`/dashboard/backup-destination-stats`)
  }

  getAllHypervisorManagers () {
    return this.vprotectApiService.get(`/hypervisor-managers`)
  }

  submitTaskSync (task) {
    return this.vprotectApiService.post(`/tasks/inventory-sync`, task)
  }

  getVirtualMachines () {
    return this.vprotectApiService.get(`/virtual-machines?hypervisor-manager-type=RHV`)
  }

  getPolicies (type) {
    return this.vprotectApiService.get(`/policies/${type}?extended=true`)
  }

  getBackupDestinationsForVMs (vms) {
    return this.vprotectApiService.post(`/backup-destinations/usable-for-vms`, vms)
  }

  submitExportTask (task) {
    return this.vprotectApiService.post(`/tasks/export`, task)
  }

  getRestorableBackups (virtualMachineGuid) {
    return this.vprotectApiService.get(`/backups?protected-entity=${virtualMachineGuid}&status=SUCCESS`)
  }

  getHypervisorManagersAvailableForBackup (id) {
    return this.vprotectApiService.get(`/hypervisor-managers/?backup-to-be-restored=${id}`)
  }

  getHypervisorStoragesForHvm (id) {
    return this.vprotectApiService.get(`/hypervisor-storages?hypervisor-manager=${id}`)
  }

  getHypervisorClustersForHvm (id) {
    return this.vprotectApiService.get(`/hypervisor-clusters?hypervisor-manager=${id}`)
  }

  submitTaskRestoreAndImport (task) {
    return this.vprotectApiService.post(`/tasks/restore-and-import`, task)
  }

  getAllTasks () {
    return this.vprotectApiService.get('/tasks')
  }

  cancelTask (id, state) {
    return this.vprotectApiService.put(`/tasks/${id}/state`, state)
  }

  deleteOrCancelTask (id) {
    return this.vprotectApiService.delete(`/tasks/${id}`)
  }

  deleteQueuedOrFinishedTasks () {
    return this.vprotectApiService.delete(`/tasks/all-finished-and-queued`)
  }

  deleteFinishedTasks () {
    return this.vprotectApiService.delete(`/tasks/all-finished`)
  }

  cancelRunningTasks () {
    return this.vprotectApiService.delete(`/tasks/all-running`)
  }

  getProtectedEntityBackups (id) {
    return this.vprotectApiService.get(`/backups?protected-entity=${id}`)
  }

  getBackupTypes (vm) {
    let backupTypes = [{name: 'FULL', description: 'Full'}]
    if (this.isIncrementalAvailable(vm)) {
      backupTypes.push({name: 'INCREMENTAL', description: 'Incremental'})
    }
    return backupTypes
  }

  isIncrementalAvailable (vm) {
    return (vm.hvType != null && this._hvWithIncremental.includes(vm.hvType.name)) ||
      (vm.hvmType != null && this._hvmWithIncremental.includes(vm.hvmType.name))
  }
}
