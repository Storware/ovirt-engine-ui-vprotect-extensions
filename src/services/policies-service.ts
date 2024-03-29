import { vprotectApiService } from './vprotect-api-service';
import {
  getElementsWithoutProjectUuidInName,
  getElementWithoutProjectUuidInName,
} from '../utils/byProjectFilter';
import { TableParams } from '../model/pagination/TableParams';

class PoliciesService {
  assignModes = [
    { name: 'DISABLED', description: 'Disabled' },
    { name: 'ASSIGN_ONLY', description: 'Assign only' },
    { name: 'ASSIGN_AND_REMOVE', description: 'Assign and remove' },
  ];

  async getPolicies(type) {
    const res = await vprotectApiService.get(`/policies/${type}?extended=true`);
    return getElementsWithoutProjectUuidInName(res);
  }

  async getPoliciesPage(type, params) {
    const res = await vprotectApiService.get(`/policies/${type}`, {
      params: { ...params, showLoader: 'true', extended: 'true' },
      headers: {},
      paginate: true,
    });

    return {
      body: getElementsWithoutProjectUuidInName(res.body),
      totalCount: res.totalCount,
    };
  }

  async getPolicy(type, guid) {
    const res = await vprotectApiService.get(`/policies/${type}/${guid}`);
    return getElementWithoutProjectUuidInName({
      ...res,
      rules: res.rules?.filter((rule) => !rule.markedForDeletion),
    });
  }

  async getVmBackupPoliciesPage(params: TableParams) {
    const res = await vprotectApiService.get(`/policies/vm-backup`, {
      params,
      paginate: true,
    });
    res.body = getElementsWithoutProjectUuidInName(res.body);
    return res;
  }

  updatePolicy(type, id, policy) {
    return vprotectApiService.put(`/policies/${type}/${id}`, policy);
  }

  createPolicy(type, policy) {
    return vprotectApiService.post(`/policies/${type}`, policy);
  }

  getRule(guid) {
    return vprotectApiService.get(
      `/rules/vm-backup/${guid}?only-active-destinations=false`,
    );
  }

  createRule(type, rule) {
    return vprotectApiService.post(`/rules/${type}`, rule);
  }

  updateRule(guid, rule) {
    return vprotectApiService.put(`/rules/vm-backup/${guid}`, rule);
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

  getPoliciesByEntities(guids) {
    return vprotectApiService
      .post(`/policies/vm-backup/list-by-entities`, {
        protectedEntities: [guids],
      })
      .then((res) =>
        res.map((policy) => ({
          ...policy,
          rules: policy.rules?.filter((rule) => !rule.markedForDeletion),
        })),
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
