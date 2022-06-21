import { vprotectApiService } from './vprotect-api-service';
import {
  getElementsWithoutProjectUuidInName,
  getElementWithoutProjectUuidInName,
  getElementWithProjectUuidInName,
} from '../utils/byProjectFilter';

class PoliciesService {
  assignModes = [
    { name: 'DISABLED', description: 'Disabled' },
    { name: 'ASSIGN_ONLY', description: 'Assign Only' },
    { name: 'ASSIGN_AND_REMOVE', description: 'Assign And Remove' },
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

  async getAllVmBackupPolicies() {
    const res = await vprotectApiService.get('/policies/vm-backup');
    return getElementsWithoutProjectUuidInName(res);
  }

  async getAllSnapshotMgmtPolicies() {
    const res = await vprotectApiService.get('/policies/vm-snapshot');
    return getElementsWithoutProjectUuidInName(res);
  }

  submitTaskSnapshot(task) {
    return vprotectApiService.post('/tasks/vm-snapshot', task);
  }

  isSnapshotManagementAvailable(vm) {
    const hvmWithSnapshotMgmt = ['AWS', 'NUTANIX', 'RHEV', 'RHV', 'VCENTER'];
    const hvWithSnapshotMgmt = ['CITRIX', 'PROXMOX', 'ESXI', 'HYPERV'];

    return (
      (vm.hvType != null && hvWithSnapshotMgmt.includes(vm.hvType.name)) ||
      (vm.hvmType != null && hvmWithSnapshotMgmt.includes(vm.hvmType.name))
    );
  }

  autoAssignmentPreview(type = '', model) {
    return vprotectApiService.post(
      `/policies/${type}/${
        model.guid ? `${model.guid}/` : ''
      }auto-assignment-preview`,
      model,
    );
  }
}

export const policiesService = new PoliciesService();
