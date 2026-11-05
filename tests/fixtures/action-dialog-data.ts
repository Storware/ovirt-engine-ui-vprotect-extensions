import { vmDetailsData, vmGuid } from './vm-details-data';
import { policyScheduleData } from './policy-schedule-data';
import { GiB } from './page-data';

export function actionDialogData(build: 'OPENSTACK' | 'OVIRT') {
  const details = vmDetailsData(build, false);
  const { policy } = policyScheduleData(build, 'vm-backup');
  const vm = {
    ...details[`/virtual-machines/${vmGuid}`],
    hvManager: {
      guid: 'manager-main',
      url: `https://${build.toLowerCase()}.example.test`,
    },
    hvCluster: { guid: 'cluster-production', name: 'Production cluster' },
    vmBackupPolicy: policy,
  };
  const backup = {
    ...details['/restore-jobs'][0].backup,
    protectedEntity: { guid: vmGuid, name: vm.name },
    backupRule: { guid: 'rule-daily' },
    iscsiMountable: true,
    networkInterfaceCards: [],
  };
  const location = {
    ...backup.backupLocations[0],
    snapshotTime: backup.snapshotTime,
    type: backup.type,
    roleType: { name: 'PRIMARY', description: 'Primary' },
    retentionHint: {
      name: 'STANDARD_RETENTION',
      description: 'Use retention settings from the policy',
    },
    backup: { guid: backup.guid, name: vm.name },
  };
  backup.backupLocations = [location];
  const files = [
    {
      guid: 'backup-disk-system',
      path: '/backups/system.qcow2',
      backupFileType: { name: 'DISK' },
      size: 40 * GiB,
      backupTime: backup.backupTime,
      iscsiMountable: true,
      vmDisk: { originalStorage: { guid: 'storage-production' } },
    },
  ];
  const fileSystems = [
    {
      guid: 'fs-system',
      volume: '/dev/sda1',
      size: 40 * GiB,
      type: 'ext4',
      label: 'System',
    },
  ];
  const securityGroup = {
    guid: 'sg-database',
    uuid: 'sg-uuid-001',
    name: 'database-access',
  };
  const responses = {
    '/policies/vm-backup/list-by-entities': [policy],
    '/backup-destinations/usable-for-vms':
      policy.rules[0].ruleBackupDestinations.map((r) => r.backupDestination),
    '/backup-locations': [location],
    '/virtual-machines/incremental-not-possible': [
      {
        virtualMachine: vm,
        reasons: [
          {
            name: 'MISSING_INCREMENTAL_SCHEDULER',
            description: 'No incremental schedule configured',
          },
        ],
      },
    ],
    [`/backups/${backup.guid}`]: backup,
    '/backup-files/detailed/for-restore': files,
    '/backup-files': files,
    '/file-systems': fileSystems,
    '/hypervisor-managers/': [vm.hvManager],
    '/hypervisor-clusters': [
      {
        guid: 'cluster-production',
        uuid: 'cluster-uuid',
        name: 'Production cluster',
      },
    ],
    '/hypervisor-storages': [
      {
        guid: 'storage-production',
        uuid: 'storage-uuid',
        name: 'Production storage',
        clusters: [{ guid: 'cluster-production' }],
      },
    ],
    '/virtual-machine-flavors': [{ name: 'medium' }, { name: 'large' }],
    '/network': [{ guid: 'network-production', name: 'Production network' }],
    '/network/shared': [],
    '/nodes': [{ guid: 'node-main', name: 'backup-node-01' }],
    '/openstack/restore-settings/project-restriction': {
      networkSection: {
        sourceNetworkWithSecurityGroups: [
          {
            guid: 'nic-0',
            name: 'eth0',
            defaultNetworkInternalId: 'network-production',
            defaultMacAddress: '02:00:00:00:00:01',
            securityGroupsFromBackup: [securityGroup],
          },
        ],
        targetNetworks: [
          {
            guid: 'network-production',
            uuid: 'network-uuid',
            name: 'Production network',
          },
        ],
        securityGroupsFromHypervisorManager: [securityGroup],
      },
    },
    '/rules/vm-backup/rule-daily': policy.rules[0],
    '/retention/mark-backups/preview': [
      {
        ...location,
        previousType: backup.type,
        previousHint: location.retentionHint,
        retentionHint: { name: 'TO_REMOVE', description: 'Mark as expired' },
        archiveExpire: Date.parse('2026-12-03T12:00:00Z'),
      },
    ],
  };
  return {
    details: {
      ...details,
      [`/virtual-machines/${vmGuid}`]: vm,
      '/backups': [backup],
    },
    vm,
    backup,
    responses,
  };
}
