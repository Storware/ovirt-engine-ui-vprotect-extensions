export const GiB = 1024 ** 3;
const timestamp = Date.parse('2026-11-03T10:00:00Z');

export const virtualMachines = [
  {
    guid: 'vm-database',
    name: 'database-production',
    uuid: 'openstack-instance-001',
    present: true,
    vmBackupPolicy: { name: 'uuid_project_Daily backups' },
    backupUpToDate: true,
    lastBackup: timestamp,
    lastSuccessfulBackupSize: 80 * GiB,
  },
  {
    guid: 'vm-web',
    name: 'web-server',
    uuid: 'openstack-instance-002',
    present: true,
    vmBackupPolicy: { name: 'uuid_project_Weekly backups' },
    backupUpToDate: false,
    lastBackup: timestamp - 86400000,
    lastSuccessfulBackupSize: 16 * GiB,
  },
  {
    guid: 'vm-absent',
    name: 'retired-instance',
    uuid: 'openstack-instance-003',
    present: false,
  },
];

export const policies = [
  {
    guid: 'policy-daily',
    name: 'uuid_project_Daily backups',
    active: true,
    priority: 50,
    vmCount: 2,
    averageBackupSize: 48 * GiB,
  },
  {
    guid: 'policy-weekly',
    name: 'uuid_project_Weekly backups',
    active: false,
    priority: 10,
    vmCount: 1,
    averageBackupSize: 16 * GiB,
  },
];

export const schedules = [
  {
    guid: 'schedule-nightly',
    name: 'uuid_project_Nightly backup',
    active: true,
    executionType: { name: 'TIME' },
    hour: 2 * 60 * 60 * 1000,
    daysOfWeek: [{ name: 'MONDAY' }, { name: 'WEDNESDAY' }, { name: 'FRIDAY' }],
    backupType: { name: 'FULL', description: 'Full backup' },
    rules: [{ guid: 'rule-daily' }],
    startWindowLength: 3600000,
  },
  {
    guid: 'schedule-incremental',
    name: 'uuid_project_Hourly incremental',
    active: false,
    executionType: { name: 'INTERVAL' },
    hour: 0,
    interval: { frequency: 3600000 },
    daysOfWeek: [{ name: 'TUESDAY' }, { name: 'THURSDAY' }],
    backupType: { name: 'INCREMENTAL', description: 'Incremental Backup' },
    rules: [],
    startWindowLength: 1800000,
  },
];

export const tasks = [
  {
    guid: 'task-finished',
    state: { name: 'FINISHED', description: 'Finished' },
    progress: 100,
    backupType: { description: 'Full' },
    type: { description: 'Backup' },
    hypervisorManager: { name: 'OpenStack' },
    protectedEntity: { name: 'database-production' },
    node: { name: 'backup-node-01' },
    backupDestination: { name: 'Primary storage' },
    originEntity: { type: { name: 'SCHEDULE', description: 'Schedule' } },
    priority: 50,
    startTime: timestamp,
    finishTime: timestamp + 180000,
    windowStart: timestamp,
    windowEnd: timestamp + 3600000,
  },
  {
    guid: 'task-failed',
    state: { name: 'FAILED', description: 'Failed' },
    progress: 35,
    backupType: { description: 'Incremental' },
    type: { description: 'Backup' },
    hypervisorManager: { name: 'OpenStack' },
    protectedEntity: { name: 'web-server' },
    node: { name: 'backup-node-02' },
    backupDestination: { name: 'Secondary storage' },
    originEntity: { type: { name: 'USER', description: 'User' } },
    priority: 10,
    startTime: timestamp,
    finishTime: timestamp + 60000,
    windowStart: timestamp,
    windowEnd: timestamp + 1800000,
  },
];

export const workflows = tasks.map((task) => ({
  ...task,
  guid: `workflow-${task.guid}`,
  averageProgress: task.progress,
  definitionName: { description: 'Virtual Environment Backup' },
  currentStep: {
    description: task.state.name === 'FINISHED' ? 'Completed' : 'Export failed',
  },
  backupDestinations: [task.backupDestination],
}));

export const mountedBackups = [
  {
    guid: 'mount-database',
    backup: {
      protectedEntity: { guid: 'vm-database', name: 'database-production' },
      snapshotTime: timestamp,
    },
    mode: { description: 'Read only' },
    state: { name: 'FINISHED', description: 'Mounted' },
    node: { name: 'backup-node-01' },
    mountedFileSystemCount: 2,
    mountedFileCount: 150,
  },
  {
    guid: 'mount-web',
    backup: {
      protectedEntity: { guid: 'vm-web', name: 'web-server' },
      snapshotTime: timestamp - 86400000,
    },
    mode: { description: 'Read / write' },
    state: { name: 'FINISHED', description: 'Mounted' },
    node: { name: 'backup-node-02' },
    mountedFileSystemCount: 1,
    mountedFileCount: 0,
  },
];

export const mailingLists = [
  { guid: 'mail-operations', name: 'Backup operators', recipientCount: 2 },
  { guid: 'mail-alerts', name: 'Critical alerts', recipientCount: 1 },
];

export const sizeReport = [
  { name: 'database-production', size: 80 * GiB },
  { name: 'web-server', size: 16 * GiB },
];

export function report(empty: boolean, projectPrefix = 'uuid_project_') {
  return Object.fromEntries(
    ['backups', 'restores'].map((type) => [
      type,
      {
        successful: empty ? 0 : 8,
        inProgress: empty ? 0 : 1,
        queued: 0,
        failed: empty ? 0 : 1,
        total: empty ? 0 : 10,
        totalData: empty ? '0 B' : '96 GB',
        elements: empty
          ? []
          : [
              {
                protectedEntity: 'database-production',
                protectedEntityGuid: 'vm-database',
                policy: `${projectPrefix}Daily backups`,
                snapshotTime: timestamp,
                restoreTime: timestamp,
                size: 80 * GiB,
                type: 'Full',
                status: { description: 'Success' },
                statusInfo: 'Completed successfully',
              },
              {
                protectedEntity: 'web-server',
                protectedEntityGuid: 'vm-web',
                policy: `${projectPrefix}Weekly backups`,
                snapshotTime: timestamp - 86400000,
                restoreTime: timestamp - 86400000,
                size: 16 * GiB,
                type: 'Incremental',
                status: { description: 'Failed' },
                statusInfo: 'Storage unavailable',
              },
            ],
      },
    ]),
  );
}
