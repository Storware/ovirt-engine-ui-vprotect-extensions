import getPluginApi from '../plugin-api'
import {webadminToastTypes} from '../constants'

const vprotectURL = getPluginApi().configObject().vProtectURL

export class VprotectService {
  _hvWithIncremental = ['KVM', 'CITRIX', 'ESXI', 'HYPERV'];
  _hvmWithIncremental = ['RHV', 'NUTANIX', 'VCENTER'];

  login (username, password) {
    return fetch(vprotectURL + '/session/login', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({login: username, password: password})
    })
      .then(response => {
        if(!response.ok){
          getPluginApi().showToast(webadminToastTypes.danger, response.statusText)
          return Promise.reject(response)
        }
        return response.json()
      })
  }

  getVirtualMachines () {
    return fetch(vprotectURL + '/virtual-machines', {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if(!response.ok){
          getPluginApi().showToast(webadminToastTypes.danger, response.statusText)
          return Promise.reject(response)
        }
        return response.json()
      })
  }

  getBackupDestinationsForVMs (vms) {
    return fetch(vprotectURL + '/backup-destinations/usable-for-vms', {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vms)
    })
      .then(response => {
        if(!response.ok){
          getPluginApi().showToast(webadminToastTypes.danger, response.statusText)
          return Promise.reject(response)
        }
        return response.json()
      })
  }

  submitExportTask (task) {
    return fetch(vprotectURL + '/tasks/export', {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
      .then(response => {
        if(!response.ok){
          getPluginApi().showToast(webadminToastTypes.danger, response.statusText)
          return Promise.reject(response)
        }
        return response.json()
      })
  }

  getBackupTypes (vm) {
    let backupTypes = [{name: 'FULL', description: 'Full'}];
    if(this.isIncrementalAvailable(vm)){
      backupTypes.push({name: 'INCREMENTAL', description: 'Incremental'})
    }
    return backupTypes;
  }

  isIncrementalAvailable(vm) {
    return (vm.hvType != null && this._hvWithIncremental.includes(vm.hvType.name))
      || (vm.hvmType != null && this._hvmWithIncremental.includes(vm.hvmType.name));
  }
}
