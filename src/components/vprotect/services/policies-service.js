import {vprotectApiService} from './vprotect-api-service'

class PoliciesService {
  assignModes = [
    {name: 'DISABLED', description: 'Disabled'},
    {name: 'ASSIGN_ONLY', description: 'AssignOnly'},
    {name: 'ASSIGN_AND_REMOVE', description: 'AssignAndRemove'}
  ]

  getPolicies (type) {
    return vprotectApiService.get(`/policies/${type}?extended=true`)
  }

  getPolicy (type, guid) {
    return vprotectApiService.get(`/policies/${type}/${guid}`)
  }

  updatePolicy (type, id, policy) {
    return vprotectApiService.put(`/policies/${type}/${id}`, policy)
  }

  createPolicy (type, policy) {
    return vprotectApiService.post(`/policies/${type}`, policy)
  }

  createRule (type, rule) {
    return vprotectApiService.post(`/rules/${type}`, rule)
  }

  updateRule (type, guid, rule) {
    return vprotectApiService.put(`/rules/${type}/${guid}`, rule)
  }
}

export const policiesService = new PoliciesService()
