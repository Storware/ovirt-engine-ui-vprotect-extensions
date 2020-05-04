import {vprotectApiService} from './vprotect-api-service'

class VprotectService {
  _hvWithIncremental = ['KVM', 'CITRIX', 'ESXI', 'HYPERV'];
  _hvmWithIncremental = ['RHV', 'NUTANIX', 'VCENTER'];

  diskAllocationFormats = [
    {name: 'PREALLOCATED', description: 'Preallocated'},
    {name: 'SPARSE', description: 'Sparse'}
  ];

  login (username, password) {
    return vprotectApiService.post(`/session/login`, {login: username, password: password})
  }

  getDashboardProtectionInfo () {
    return vprotectApiService.get(`/dashboard/protection`)
  }

  getDashboardBackupStats (params = {}) {
    const httpOptions = {
      params: params
    }
    return vprotectApiService.get('/dashboard/backup-stats', httpOptions)
  }

  getDashboardStagingSpaceInfo () {
    return vprotectApiService.get(`/dashboard/staging-space`)
  }

  getDashboardBackupDestinationStats () {
    return vprotectApiService.get(`/dashboard/backup-destination-stats`)
  }

  submitTaskSync (task) {
    return vprotectApiService.post(`/tasks/inventory-sync`, task)
  }

  submitExportTask (task) {
    return vprotectApiService.post(`/tasks/export`, task)
  }

  getRestorableBackups (virtualMachineGuid) {
    return vprotectApiService.get(`/backups?protected-entity=${virtualMachineGuid}&status=SUCCESS`)
  }

  getHypervisorManagersAvailableForBackup (id) {
    return vprotectApiService.get(`/hypervisor-managers/?backup-to-be-restored=${id}`)
  }

  getHypervisorStoragesForHvm (id) {
    return vprotectApiService.get(`/hypervisor-storages?hypervisor-manager=${id}`)
  }

  getHypervisorClustersForHvm (id) {
    return vprotectApiService.get(`/hypervisor-clusters?hypervisor-manager=${id}`)
  }

  submitTaskRestoreAndImport (task) {
    return vprotectApiService.post(`/tasks/restore-and-import`, task)
  }

  getAllTasks () {
    return vprotectApiService.get('/tasks')
  }

  cancelTask (id, state) {
    return vprotectApiService.put(`/tasks/${id}/state`, state)
  }

  deleteOrCancelTask (id) {
    return vprotectApiService.delete(`/tasks/${id}`)
  }

  deleteQueuedOrFinishedTasks () {
    return vprotectApiService.delete(`/tasks/all-finished-and-queued`)
  }

  deleteFinishedTasks () {
    return vprotectApiService.delete(`/tasks/all-finished`)
  }

  cancelRunningTasks () {
    return vprotectApiService.delete(`/tasks/all-running`)
  }

  getProtectedEntityBackups (id) {
    return vprotectApiService.get(`/backups?protected-entity=${id}`)
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

export const vprotectService = new VprotectService()
