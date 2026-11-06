import * as data from './page-data';

export {
  GiB,
  mailingLists,
  mountedBackups,
  report,
  sizeReport,
} from './page-data';

export const hypervisors = [
  {
    guid: 'hypervisor-01',
    name: 'ovirt-host-01',
    host: 'ovirt-host-01.example.test',
  },
  {
    guid: 'hypervisor-02',
    name: 'ovirt-host-02',
    host: 'ovirt-host-02.example.test',
  },
];
export const clusters = [
  { guid: 'cluster-production', name: 'Production cluster' },
];
export const managers = [
  {
    guid: 'manager-ovirt',
    name: 'oVirt engine',
    url: 'https://ovirt.example.test',
    type: { name: 'RHV' },
  },
];

export const virtualMachines = data.virtualMachines.map((vm, index) => ({
  ...vm,
  uuid: `ovirt-vm-00${index + 1}`,
  hypervisor: hypervisors[index % hypervisors.length],
  vmBackupPolicy: vm.vmBackupPolicy && {
    ...vm.vmBackupPolicy,
    name: vm.vmBackupPolicy.name.replace('uuid_project_', ''),
  },
}));
export const policies = data.policies.map((policy) => ({
  ...policy,
  name: policy.name.replace('uuid_project_', ''),
}));
export const schedules = data.schedules.map((schedule) => ({
  ...schedule,
  name: schedule.name.replace('uuid_project_', ''),
}));
export const tasks = data.tasks.map((task) => ({
  ...task,
  hypervisorManager: managers[0],
}));
export const workflows = data.workflows.map((workflow) => ({
  ...workflow,
  hypervisorManager: managers[0],
}));

export const stagingSpace = [
  {
    node: { name: 'backup-node-01' },
    totalSpace: 500 * data.GiB,
    availableSpace: 300 * data.GiB,
  },
  {
    node: { name: 'backup-node-02' },
    totalSpace: 200 * data.GiB,
    availableSpace: 40 * data.GiB,
  },
];
export const backupDestinationStats = {
  totalUsedSpace: 400 * data.GiB,
  totalAvailableSpace: 1000 * data.GiB,
  backupDestinations: [
    {
      guid: 'destination-primary',
      name: 'Primary storage',
      totalUsedSpace: 400 * data.GiB,
      totalAvailableSpace: 1000 * data.GiB,
      totalDedupUsedSpace: 200 * data.GiB,
      totalDedupAvailableSpace: 1000 * data.GiB,
    },
  ],
};
