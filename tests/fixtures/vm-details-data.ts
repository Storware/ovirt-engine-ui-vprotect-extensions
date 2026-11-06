import { Request } from '@playwright/test';
import { GiB, schedules } from './page-data';

export const vmGuid = '64e632bd';
const timestamp = Date.parse('2026-11-03T10:00:00Z');

export function vmDetailsData(build: 'OPENSTACK' | 'OVIRT', empty: boolean) {
  const ovirt = build === 'OVIRT';
  const policy = { guid: 'policy-daily', name: 'Daily backups' };
  const snapshotPolicy = { guid: 'snapshot-policy', name: 'Daily snapshots' };
  const hypervisor = {
    guid: 'vm-host',
    name: 'compute-01',
    host: 'compute-01.example.test',
    node: { name: 'backup-node-01' },
  };
  const backup = {
    guid: 'backup-success',
    snapshotTime: timestamp,
    backupTime: timestamp,
    size: 80 * GiB,
    status: { name: 'SUCCESS', description: 'Success' },
    type: { name: 'FULL', description: 'Full' },
    statusInfo: 'Completed successfully',
    description: 'Daily database backup',
    warnings: [],
    warningsAcknowledged: false,
    backupLocations: [
      {
        guid: 'location-primary',
        backupDestination: {
          guid: 'destination-primary',
          name: 'Primary storage',
        },
        status: { name: 'PRESENT' },
        retentionHint: { name: 'STANDARD_RETENTION' },
      },
    ],
    originEntity: { type: { name: 'SCHEDULE', description: 'Schedule' } },
    taskTimeStats: {
      exportTime: 120000,
      queuedExportTime: 10000,
      storeTime: 60000,
      queuedStoreTime: 5000,
    },
  };
  const failedBackup = {
    ...backup,
    guid: 'backup-failed',
    snapshotTime: timestamp - 86400000,
    size: 0,
    status: { name: 'FAILED', description: 'Failed' },
    statusInfo: 'Storage unavailable',
    warnings: ['Backup destination was temporarily unavailable'],
    backupLocations: [],
  };
  const snapshot = {
    guid: 'snapshot-current',
    uuid: 'snapshot-uuid-001',
    snapshotTime: timestamp,
    policy: 'Daily snapshots',
    status: 'Success',
  };

  return {
    [`/virtual-machines/${vmGuid}`]: {
      guid: vmGuid,
      name: 'database-production',
      uuid: `${ovirt ? 'ovirt' : 'openstack'}-instance-001`,
      present: true,
      hypervisor: { guid: hypervisor.guid },
      hvmType: { name: ovirt ? 'RHV' : 'OPENSTACK' },
      hvManager: {
        url: `https://${ovirt ? 'ovirt' : 'openstack'}.example.test`,
        vmExportImportMode: { description: 'Disk attachment' },
      },
      hvCluster: { name: 'Production cluster' },
      vmFlavor: { name: 'medium' },
      vmBackupPolicy: empty ? null : policy,
      snapshotMgmtPolicy: !empty && ovirt ? snapshotPolicy : null,
      tags: empty ? [] : ['production', 'database'],
      lastBackup: empty ? null : timestamp,
      lastSuccessfulBackupSize: empty ? 0 : 80 * GiB,
      lastSuccessfulFullBackupSize: empty ? 0 : 80 * GiB,
      lastStoredSnapshot: empty ? null : { guid: snapshot.guid },
      vmExportImportMode: {
        name: 'DISK_ATTACHMENT',
        description: 'Disk attachment to proxy VM (full)',
      },
      quiesceBeforeSnapshot: true,
    },
    [`/hypervisors/${hypervisor.guid}`]: hypervisor,
    '/backups': (request: Request) => {
      const params = new URL(request.url()).searchParams;
      if (params.get('protected-entity') !== vmGuid) {
        throw new Error('VM backups requested for the wrong entity');
      }
      return empty
        ? []
        : params.has('status')
        ? [backup]
        : [backup, failedBackup];
    },
    '/restore-jobs': empty
      ? []
      : [
          {
            guid: 'restore-success',
            restoreTime: timestamp + 3600000,
            backup,
            restoreType: { name: 'RESTORE_AND_IMPORT' },
            status: { name: 'SUCCESS', description: 'Success' },
            statusInfo: 'Restored successfully',
          },
        ],
    '/snapshots': (request: Request) => {
      const params = new URL(request.url()).searchParams;
      if (params.get('protected-entity') !== vmGuid) {
        throw new Error('VM snapshots requested for the wrong entity');
      }
      return empty
        ? []
        : params.has('stand-alone')
        ? [
            {
              ...snapshot,
              guid: 'snapshot-history',
              uuid: 'snapshot-history-uuid-001',
            },
          ]
        : [snapshot];
    },
    '/virtual-machine-disks': empty
      ? []
      : [
          {
            guid: 'disk-system',
            name: 'System disk',
            uuid: 'disk-uuid-001',
            size: 40 * GiB,
            present: true,
            supported: true,
            excludedFromBackup: false,
          },
          {
            guid: 'disk-data',
            name: 'Data disk',
            uuid: 'disk-uuid-002',
            size: 100 * GiB,
            present: true,
            supported: false,
            type: { description: 'Shared disk' },
            excludedFromBackup: true,
          },
        ],
    '/schedules': empty ? [] : [{ ...schedules[0], name: 'Nightly backup' }],
    '/policies/vm-backup': [policy],
    '/policies/vm-snapshot': ovirt ? [snapshotPolicy] : [],
  };
}
