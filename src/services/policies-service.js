import { vprotectApiService } from './vprotect-api-service';

class PoliciesService {
  assignModes = [
    { name: 'DISABLED', description: 'Disabled' },
    { name: 'ASSIGN_ONLY', description: 'AssignOnly' },
    { name: 'ASSIGN_AND_REMOVE', description: 'AssignAndRemove' },
  ];

  getPolicies(type) {
    return vprotectApiService.get(`/policies/${type}?extended=true`);
  }

  getPolicy(type, guid) {
    return vprotectApiService.get(`/policies/${type}/${guid}`);
  }

  updatePolicy(type, id, policy) {
    return vprotectApiService.put(`/policies/${type}/${id}`, policy);
  }

  createPolicy(type, policy) {
    return vprotectApiService.post(`/policies/${type}`, policy);
  }

  createRule(type, rule) {
    return vprotectApiService.post(`/rules/${type}`, rule);
  }

  updateRule(type, guid, rule) {
    return vprotectApiService.put(`/rules/${type}/${guid}`, rule);
  }

  deletePolicy(type, id) {
    return vprotectApiService.delete(`/policies/${type}/${id}`);
  }

  getAllVmBackupPolicies() {
    return vprotectApiService.get('/policies/vm-backup');
  }

  getAllSnapshotMgmtPolicies() {
    return vprotectApiService.get('/policies/snapshot');
  }

  submitTaskSnapshot(task) {
    return vprotectApiService.post('/tasks/snapshot', task);
  }

  isSnapshotManagementAvailable(vm) {
    let hvmWithSnapshotMgmt = ['AWS', 'NUTANIX', 'RHEV', 'RHV', 'VCENTER'];
    let hvWithSnapshotMgmt = ['CITRIX', 'PROXMOX', 'ESXI', 'HYPERV'];

    return (
      (vm.hvType != null && hvWithSnapshotMgmt.includes(vm.hvType.name)) ||
      (vm.hvmType != null && hvmWithSnapshotMgmt.includes(vm.hvmType.name))
    );
  }
}

export const policiesService = new PoliciesService();
