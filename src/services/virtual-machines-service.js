import { vprotectApiService } from './vprotect-api-service';
import {
  hypervisorManagerImportExportModes,
  hypervisorImportExportModes,
} from './hypervisors-service';

export const preAndPostSnapStdErrorHandlingOptions = [
  { name: 'DONT_IGNORE', description: "Don't ignore" },
  { name: 'IGNORE_WITHOUT_WARNING', description: 'Ignore without warning' },
  { name: 'IGNORE_WITH_WARNING', description: 'Ignore with warning' },
];

class VirtualMachinesService {
  getVirtualMachines() {
    return vprotectApiService.get('/virtual-machines');
  }
  getFilteredVirtualMachines(param) {
    return vprotectApiService.get('/virtual-machines/detailed?filter=' + param);
  }

  getVirtualMachine(id) {
    return vprotectApiService.get('/virtual-machines/' + id);
  }

  getVirtualMachineSnapshots(id, standAlone) {
    return vprotectApiService.get('/snapshots', {
      params: {
        'protected-entity': id,
        ...(standAlone ? { 'stand-alone': standAlone.toString() } : null),
      },
    });
  }

  getVirtualMachineDisks(id) {
    return vprotectApiService.get(
      '/virtual-machine-disks?virtual-machine=' + id,
    );
  }

  updateVirtualMachineSettings(vm) {
    return vprotectApiService.put(
      '/virtual-machines/' + vm.guid + '/settings',
      vm,
    );
  }

  updateVmSshPassword(id, password) {
    return vprotectApiService.put('/virtual-machines/' + id + '/ssh-password', {
      value: password,
    });
  }

  updateVirtualMachineDiskSettings(vmDisk) {
    return vprotectApiService.put(
      '/virtual-machine-disks/' + vmDisk.guid + '/settings',
      vmDisk,
    );
  }

  deleteAllNonPresentAndWithoutBackup() {
    return vprotectApiService.delete('/virtual-machines/all-non-present');
  }

  areSnapshotsFreezable(vm) {
    const hvFreezable = ['CITRIX', 'ESXI'];
    const hvmFreezable = [
      'RHEV',
      'RHV',
      'NUTANIX',
      'KUBERNETES',
      'OPENSHIFT',
      'VCENTER',
    ];
    return (
      (vm.hvType != null && hvFreezable.includes(vm.hvType.name)) ||
      (vm.hvmType != null && hvmFreezable.includes(vm.hvmType.name))
    );
  }

  getVirtualMachineExportImportModes(vm) {
    let modes;
    if (vm.hvmType != null) {
      modes = hypervisorManagerImportExportModes[vm.hvmType.name];
      if (modes.every((el) => el.name !== 'INHERIT')) {
        modes.push({
          name: 'INHERIT',
          description: `Inherited from Hypervisor Manager: ${vm.hvManager.vmExportImportMode.description}`,
        });
      }
    } else {
      modes = hypervisorImportExportModes;
      if (modes.every((el) => el.name !== 'INHERIT')) {
        modes.push({
          name: 'INHERIT',
          description: `Inherited from Hypervisor: ${vm.hypervisor.vmExportImportMode.description}`,
        });
      }
    }
    return modes;
  }

  arePrePostSnapActionsAvailable(vm) {
    const hvWithPrePostSnapActions = [
      'CITRIX',
      'KVM',
      'XEN',
      'PROXMOX',
      'HYPERV',
    ];
    const hvmWithPrePostSnapActions = [
      'NUTANIX',
      'RHEV',
      'RHV',
      'VCENTER',
      'ORACLE',
    ];
    return (
      (vm.hvType != null &&
        hvWithPrePostSnapActions.includes(vm.hvType.name)) ||
      (vm.hvmType != null &&
        hvmWithPrePostSnapActions.includes(vm.hvmType.name))
    );
  }

  getVirtualMachinesNotReadyForIncremental(entities) {
    return vprotectApiService.post(
      '/virtual-machines/incremental-not-possible',
      entities,
    );
  }
}

export const virtualMachinesService = new VirtualMachinesService();
