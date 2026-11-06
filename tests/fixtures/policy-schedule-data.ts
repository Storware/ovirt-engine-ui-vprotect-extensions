import {
  mailingLists,
  policies,
  schedules,
  virtualMachines,
} from './page-data';

export function policyScheduleData(build: 'OPENSTACK' | 'OVIRT', type: string) {
  const name = (value: string) =>
    build === 'OPENSTACK' ? value : value.replace('uuid_project_', '');
  const clusters = [{ guid: 'cluster-production', name: 'Production cluster' }];
  const destinations = ['Primary storage', 'Secondary storage'].map(
    (name, i) => ({
      guid: `destination-${i}`,
      name,
      defaultBackupDestination: i === 0,
      type: { name: 'FILESYSTEM', description: 'File system' },
    }),
  );
  const schedule = {
    ...schedules[0],
    name: name(schedules[0].name),
    executionType: { name: 'TIME', description: 'Time' },
    type: { name: type === 'vm-backup' ? 'VM_BACKUP' : 'VM_SNAPSHOT' },
    months: [{ name: 'JANUARY' }, { name: 'NOVEMBER' }],
    dayOfWeekOccurrences: [
      { name: 'FIRST_IN_MONTH', description: 'FIRST IN MONTH' },
    ],
    interval: null,
  };
  const policy = {
    ...policies[0],
    name: name(policies[0].name),
    active: true,
    autoRemoveNonPresent: true,
    backupRetryCount: 3,
    dailyReportEnabled: true,
    mailingList: mailingLists[0],
    failRemainingBackupTasksExportThreshold: 50,
    failRemainingBackupTasksStoreThreshold: 75,
    scanFileSystem: true,
    autoAssignSettings: {
      mode: { name: 'ASSIGN_AND_REMOVE', description: 'Assign and remove' },
      includeTags: ['production'],
      excludeTags: ['temporary'],
      includeRegExps: ['^database-.*'],
      excludeRegExps: ['.*-test$'],
      hvClusters: clusters,
    },
    vms: [virtualMachines[0]],
    rules: [
      {
        guid: 'rule-daily',
        name: 'Default',
        active: true,
        position: 0,
        retentionVersions: 7,
        retentionDays: 30,
        schedules: [schedule],
        ruleBackupDestinations: destinations.map((backupDestination, i) => ({
          active: true,
          roleType: { name: i === 0 ? 'PRIMARY' : 'SECONDARY' },
          backupDestination,
          daysToKeepRetentionLock: 7,
          backupRetentionSettings: {
            retentionKeepLastNFull: 4,
            retentionKeepLastNIncremental: 30,
            retentionKeepFullNewerThan: 30 * 86400000,
            retentionKeepIncrementalNewerThan: 7 * 86400000,
            keepLastBackupWhenSourceStillExists: true,
          },
        })),
      },
    ],
  };
  return { clusters, destinations, policy, schedule };
}
