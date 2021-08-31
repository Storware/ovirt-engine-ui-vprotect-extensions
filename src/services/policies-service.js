import { vprotectApiService } from './vprotect-api-service';
import {
  getElementsWithoutProjectUuidInName,
  getElementWithoutProjectUuidInName,
  getElementWithProjectUuidInName,
} from '../utils/byProjectFilter';

class PoliciesService {
  assignModes = [
    { name: 'DISABLED', description: 'Disabled' },
    { name: 'ASSIGN_ONLY', description: 'AssignOnly' },
    { name: 'ASSIGN_AND_REMOVE', description: 'AssignAndRemove' },
  ];

  async getPolicies(type) {
    const res = await vprotectApiService.get(`/policies/${type}?extended=true`);
    return getElementsWithoutProjectUuidInName(res);
  }

  async getPolicy(type, guid) {
    const res = await vprotectApiService.get(`/policies/${type}/${guid}`);
    return getElementWithoutProjectUuidInName(res);
  }

  updatePolicy(type, id, policy) {
    return vprotectApiService.put(
      `/policies/${type}/${id}`,
      getElementWithProjectUuidInName(policy),
    );
  }

  createPolicy(type, policy) {
    return vprotectApiService.post(
      `/policies/${type}`,
      getElementWithProjectUuidInName(policy),
    );
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
    return vprotectApiService.get('/policies/vm-snapshot');
  }

  submitTaskSnapshot(task) {
    return vprotectApiService.post('/tasks/vm-snapshot', task);
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
