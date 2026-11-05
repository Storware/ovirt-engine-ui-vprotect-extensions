import { Request } from '@playwright/test';
import { actionDialogData } from './fixtures/action-dialog-data';
import { policyScheduleData } from './fixtures/policy-schedule-data';
import { expect, openPage, test } from './fixtures/visual-test';
import { vmDetailsData, vmGuid } from './fixtures/vm-details-data';
import {
  fileSystemGuid,
  filesystemListing,
  mountedBackup,
  mountedBackupGuid,
  mountedFiles,
  mountedFileSystems,
} from './fixtures/mounted-backup-data';
import {
  GiB,
  mailingLists,
  mountedBackups,
  policies,
  report,
  schedules,
  sizeReport,
  tasks,
  virtualMachines,
  workflows,
} from './fixtures/page-data';

for (const scenario of [
  { name: 'desktop', width: 1440, empty: false },
  { name: 'compact', width: 1024, empty: false },
  { name: 'empty', width: 1440, empty: true },
]) {
  test(`OpenStack dashboard - ${scenario.name}`, async ({ page, api }) => {
    await page.setViewportSize({ width: scenario.width, height: 1000 });
    Object.assign(api, {
      '/dashboard/protection': {
        vm: scenario.empty
          ? { protectedNo: 0, notProtected: 0, noSchedule: 0 }
          : { protectedNo: 8, notProtected: 3, noSchedule: 1 },
      },
      '/dashboard/backup-stats': {
        successful: scenario.empty ? 0 : 14,
        failed: scenario.empty ? 0 : 3,
        inProgress: scenario.empty ? 0 : 1,
        queued: 0,
        totalData: scenario.empty ? '0 B' : '128 GB',
      },
      '/dashboard/staging-space': [],
      '/chargeback-reporting/backup-size/vm': scenario.empty
        ? []
        : [
            { name: 'database-production', size: 80 * GiB },
            { name: 'application-server', size: 32 * GiB },
            { name: 'web-server', size: 16 * GiB },
          ],
      '/dashboard/vm-backup-size-stats': {
        backupSizeStatsResponses: Object.fromEntries(
          Array.from({ length: 15 }, (_, day) => [
            day,
            scenario.empty ? 0 : (day + 1) * GiB,
          ]),
        ),
        restoreSizeStatsResponses: Object.fromEntries(
          Array.from({ length: 15 }, (_, day) => [
            day,
            scenario.empty ? 0 : (day % 4) * GiB,
          ]),
        ),
      },
    });
    await openPage(page, '/dashboard', api);

    for (const name of [
      'Protection stats',
      'Success Rate',
      'Current Backup Size',
      'Activity',
    ]) {
      await expect(
        page.getByRole('heading', { name, exact: true }),
      ).toBeVisible();
    }
    await expect(
      page.getByRole('button', { name: 'Synchronize inventory' }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: 'Staging Space', exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: 'Backup Destinations', exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByText(
        `Total data protected: ${scenario.empty ? '0 B' : '128 GB'}`,
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      page.getByText(scenario.empty ? 'No data' : 'Page 1/1', { exact: true }),
    ).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(scenario.empty ? 1 : 2);
    await expect(page).toHaveScreenshot(
      `dashboard-openstack-${scenario.name}.png`,
      { fullPage: true },
    );
  });
}

const lists = [
  {
    name: 'virtual-environments',
    path: '/virtual_environments',
    endpoint: '/virtual-machines',
    data: virtualMachines,
    marker: 'database-production',
    column: 'Last backup date',
  },
  {
    name: 'task-console',
    path: '/task_console',
    endpoint: '/tasks',
    data: tasks,
    marker: 'database-production',
    column: 'Window start',
  },
  {
    name: 'workflow-execution',
    path: '/workflow_execution',
    endpoint: '/workflow-executions',
    data: workflows,
    marker: 'database-production',
    column: 'Step',
  },
  {
    name: 'policies',
    path: '/policies_and_schedules',
    endpoint: '/policies/vm-backup',
    data: policies,
    marker: 'Daily backups',
    column: 'VM Count',
  },
  {
    name: 'schedules',
    path: '/policies_and_schedules/vm-backup/schedules',
    endpoint: '/schedules',
    data: schedules,
    marker: 'Nightly backup',
    column: 'Backup Type',
  },
  {
    name: 'mounted-backups',
    path: '/mounted_backups',
    endpoint: '/mounted-backups',
    data: mountedBackups,
    marker: 'database-production',
    column: 'File systems',
  },
  {
    name: 'mailing-lists',
    path: '/settings',
    endpoint: '/mailing-lists',
    data: mailingLists,
    marker: 'Backup operators',
    column: 'Recipient count',
  },
];

for (const view of lists) {
  for (const empty of [false, true]) {
    const state = empty ? 'empty' : 'populated';
    test(`OpenStack ${view.name} - ${state}`, async ({ page, api }) => {
      api[view.endpoint] = empty ? [] : view.data;
      await openPage(page, view.path, api);
      if (view.name === 'policies')
        await expect(page).toHaveURL(
          /\/policies_and_schedules\/vm-backup\/policies$/,
        );
      if (view.name === 'mailing-lists')
        await expect(page).toHaveURL(/\/settings\/mailing-list$/);
      await expect(
        page.getByRole('columnheader', { name: view.column }),
      ).toBeVisible();
      if (empty) {
        await expect(
          page.getByText('No results found', { exact: true }),
        ).toBeVisible();
      } else {
        await expect(
          page.getByRole('row').filter({ hasText: view.marker }),
        ).toBeVisible();
        await expect(page.locator('.p-datatable-tbody > tr')).toHaveCount(
          view.data.length,
        );
      }
      if (view.name === 'virtual-environments') {
        await expect(
          page.getByRole('columnheader', { name: /^Hypervisor/ }),
        ).toHaveCount(0);
      }
      if (view.name === 'schedules') {
        await expect(
          page.getByRole('button', { name: 'Create', exact: true }),
        ).toBeVisible();
      }
      await expect(page).toHaveScreenshot(
        `${view.name}-openstack-${state}.png`,
        { fullPage: true },
      );
    });
  }
}

for (const tab of [
  'summary',
  'backups',
  'restores',
  'backup-size',
  'transfer-size',
]) {
  for (const empty of [false, true]) {
    const state = empty ? 'empty' : 'populated';
    test(`OpenStack reporting ${tab} - ${state}`, async ({ page, api }) => {
      if (tab === 'backup-size' || tab === 'transfer-size') {
        Object.assign(api, {
          [`/chargeback-reporting/${tab}/vm`]: empty ? [] : sizeReport,
          '/backup-destinations': [
            { guid: 'destination-primary', name: 'Primary storage' },
          ],
          '/policies/vm-backup': policies,
          '/virtual-machines': virtualMachines,
        });
      } else {
        api['/dashboard/report'] = report(empty);
      }
      await openPage(page, `/reporting/${tab}`, api);
      await expect(
        page.locator('.p-dropdown-label').filter({ hasText: /^Export$/ }),
      ).toBeVisible();
      if (tab === 'summary') {
        await expect(
          page.getByText('Successful backups', { exact: true }),
        ).toBeVisible();
        await expect(
          page.getByText(`Data Protected: ${empty ? '0 B' : '96 GB'}`, {
            exact: true,
          }),
        ).toBeVisible();
        await expect(page.locator('canvas')).toHaveCount(2);
      } else if (tab === 'backups' || tab === 'restores') {
        await expect(
          page.getByRole('columnheader', {
            name: 'Virtual Environment',
          }),
        ).toBeVisible();
        await expect(
          page.getByText(empty ? 'No results found' : 'database-production', {
            exact: true,
          }),
        ).toBeVisible();
      } else {
        await expect(
          page.getByRole('button', { name: 'Generate report', exact: true }),
        ).toBeVisible();
        await expect(
          page.getByText(empty ? 'No data' : 'Page 1/1', { exact: true }),
        ).toBeVisible();
        await expect(page.locator('canvas')).toHaveCount(empty ? 0 : 1);
        await expect(
          page.getByText('Hypervisor Manager', { exact: true }),
        ).toHaveCount(0);
      }
      await expect(page).toHaveScreenshot(
        `reporting-${tab}-openstack-${state}.png`,
        { fullPage: true },
      );
    });
  }
}

test('OpenStack mailing list - create form', async ({ page, api }) => {
  await openPage(page, '/settings/mailing-list/create', api);
  await expect(page.getByText('Mailing List', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Save', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Add recipient', exact: true })
    .click();
  await page.clock.runFor(100);
  await expect(page.locator('.recipient-input')).toHaveCount(1);
  await expect(page).toHaveScreenshot('mailing-list-openstack-create.png', {
    fullPage: true,
  });
});

test('OpenStack mailing list - edit form', async ({ page, api }) => {
  api['/mailing-lists/mail-operations'] = {
    guid: 'mail-operations',
    name: 'Backup operators',
    recipients: ['operator@example.test', 'alerts@example.test'],
  };
  await openPage(page, '/settings/mailing-list/mail-operations', api);
  await expect(page.locator('input[name="name"]')).toHaveValue(
    'Backup operators',
  );
  await expect(page.locator('.recipient-input')).toHaveCount(2);
  await expect(page).toHaveScreenshot('mailing-list-openstack-edit.png', {
    fullPage: true,
  });
});

for (const empty of [false, true]) {
  for (const tab of [
    { name: 'Backup', slug: 'backups', count: 1, column: 'Locations' },
    {
      name: 'Backup History',
      slug: 'backup-history',
      count: 2,
      column: 'Status',
    },
    {
      name: 'Restore History',
      slug: 'restore-history',
      count: 1,
      column: 'Restore time',
    },
    {
      name: 'Snapshots',
      slug: 'snapshots',
      count: 1,
      column: 'Current for incremental backup',
    },
    {
      name: 'Snapshots History',
      slug: 'snapshots-history',
      count: 1,
      column: 'UUID',
    },
    { name: 'Disks', slug: 'disks', count: 2, column: 'Excluded from backup' },
    {
      name: 'Schedules',
      slug: 'schedules',
      count: 1,
      column: 'Start window [min]',
    },
    { name: 'Settings', slug: 'settings', count: 0, column: '' },
  ]) {
    test(`OpenStack VM details ${tab.slug} - ${
      empty ? 'empty' : 'populated'
    }`, async ({ page, api, build }) => {
      await page.setViewportSize({ width: 1440, height: 1800 });
      Object.assign(api, vmDetailsData(build, empty));
      await openPage(page, `/virtual_environments/${vmGuid}`, api);
      await expect(
        page.getByText('database-production', { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText('Backup/Restore Statistics', { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText('Events Calendar', { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Restore', exact: true }),
      ).toHaveCount(empty ? 0 : 1);
      await expect(
        page.getByRole('heading', { name: 'HYPERVISOR', exact: true }),
      ).toHaveCount(build === 'OVIRT' ? 1 : 0);
      const label =
        tab.name === 'Settings'
          ? 'Settings'
          : `${tab.name} (${empty ? 0 : tab.count})`;
      api['/credential'] = [
        { guid: 'credential-linux', name: 'Linux backup user' },
      ];
      await page.getByRole('tab', { name: label, exact: true }).click();
      await page.clock.runFor(2000);
      const panel = page.getByRole('tabpanel');
      await expect(
        page.getByRole('tab', { name: label, exact: true }),
      ).toHaveAttribute('aria-selected', 'true');
      if (tab.name === 'Settings') {
        await expect(
          panel.getByRole('heading', {
            name: 'Export/Import mode',
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          panel.getByRole('heading', {
            name: 'Snapshot management policy',
            exact: true,
          }),
        ).toHaveCount(build === 'OVIRT' ? 1 : 0);
      } else {
        await expect(
          panel.getByRole('columnheader', { name: tab.column, exact: true }),
        ).toBeVisible();
        if (empty) {
          await expect(
            panel.getByText('No results found', { exact: true }),
          ).toBeVisible();
        } else {
          await expect(panel.locator('.p-datatable-tbody > tr')).toHaveCount(
            tab.count,
          );
          if (tab.name === 'Snapshots History') {
            await expect(
              panel.getByRole('cell', {
                name: 'snapshot-history-uuid-001',
                exact: true,
              }),
            ).toBeVisible();
          }
        }
      }
      // Click the unused page margin to clear tab focus and hover styles.
      await page.mouse.click(0, 0);
      await expect(page).toHaveScreenshot(
        `vm-details-openstack-${tab.slug}-${empty ? 'empty' : 'populated'}.png`,
        {
          fullPage: true,
          // Two today markers produce 36 edge pixels of rasterization noise.
          maxDiffPixels: tab.slug === 'backup-history' && !empty ? 40 : 30,
          stylePath: `${__dirname}/fixtures/vm-details.css`,
        },
      );
    });
  }
}

test('OpenStack VM details settings - credentials', async ({
  page,
  api,
  build,
}) => {
  await page.setViewportSize({ width: 1440, height: 1800 });
  Object.assign(api, vmDetailsData(build, false));
  await openPage(page, `/virtual_environments/${vmGuid}`, api);
  api['/credential'] = [
    { guid: 'credential-linux', name: 'Linux backup user' },
  ];
  await page.getByRole('tab', { name: 'Settings', exact: true }).click();
  await page.getByText('Os Credentials', { exact: true }).click();
  await page.clock.runFor(2000);
  await expect(page.getByText('Credentials', { exact: true })).toBeVisible();
  await page.mouse.click(0, 0);
  await expect(page).toHaveScreenshot(
    'vm-details-openstack-settings-credentials.png',
    {
      fullPage: true,
      maxDiffPixels: 30,
      stylePath: `${__dirname}/fixtures/vm-details.css`,
    },
  );
});

for (const empty of [false, true]) {
  for (const tab of ['File systems', 'Files']) {
    const slug = tab === 'Files' ? 'files' : 'file-systems';
    test(`OpenStack mounted backup details ${slug} - ${
      empty ? 'empty' : 'populated'
    }`, async ({ page, api }) => {
      api[`/mounted-backups/${mountedBackupGuid}`] = mountedBackup;
      api['/mounted-file-systems/detailed'] = empty ? [] : mountedFileSystems;
      await openPage(page, `/mounted_backups/${mountedBackupGuid}`, api);
      await expect(
        page.getByText('database-production', { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText('backup-node-01', { exact: true }),
      ).toBeVisible();
      await expect(page.getByText('Read only', { exact: true })).toBeVisible();
      await expect(
        page.getByText('Mounted Backup Details', { exact: true }),
      ).toBeVisible();
      if (tab === 'Files') {
        api['/mounted-files'] = empty ? [] : mountedFiles;
        await Promise.all([
          page.waitForResponse(
            (response) =>
              new URL(response.url()).pathname === '/api/mounted-files' &&
              response.ok(),
          ),
          page.getByRole('tab', { name: 'Files', exact: true }).click(),
        ]);
        await page.clock.runFor(1000);
      }
      await expect(
        page.getByRole('tab', { name: tab, exact: true }),
      ).toHaveAttribute('aria-selected', 'true');
      const panel = page.getByRole('tabpanel');
      await expect(
        panel.getByRole('columnheader', {
          name: tab === 'Files' ? 'Random path access' : /^Volume/,
        }),
      ).toBeVisible();
      if (empty) {
        await expect(
          panel.getByText('No results found', { exact: true }),
        ).toBeVisible();
      } else {
        await expect(panel.locator('.p-datatable-tbody > tr')).toHaveCount(2);
        await expect(
          panel.getByRole('cell', {
            name: tab === 'Files' ? mountedFiles[0].path : '/dev/vda1',
            exact: true,
          }),
        ).toBeVisible();
      }
      await page.mouse.click(0, 0);
      await expect(page).toHaveScreenshot(
        `mounted-backup-details-openstack-${slug}-${
          empty ? 'empty' : 'populated'
        }.png`,
        { fullPage: true },
      );
    });
  }
}

for (const view of ['root', 'empty', 'nested']) {
  test(`OpenStack mounted backup details browse - ${view}`, async ({
    page,
    api,
  }) => {
    api[`/mounted-backups/${mountedBackupGuid}`] = mountedBackup;
    api['/mounted-file-systems/detailed'] = mountedFileSystems;
    await openPage(page, `/mounted_backups/${mountedBackupGuid}`, api);
    const endpoint = `/mounted-file-systems/${fileSystemGuid}/listing`;
    api[endpoint] = filesystemListing(view === 'empty');
    await Promise.all([
      page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname === `/api${endpoint}` &&
          response.ok(),
      ),
      page
        .getByRole('row')
        .filter({ hasText: '/dev/vda1' })
        .getByRole('button', { name: 'Browse', exact: true })
        .click(),
    ]);
    await page.clock.runFor(1000);
    const dialog = page.getByRole('dialog', {
      name: 'File System',
      exact: true,
    });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('button', { name: 'Download selected', exact: true }),
    ).toBeVisible();
    if (view === 'empty') {
      await expect(
        dialog.getByText('No results found', { exact: true }),
      ).toBeVisible();
    } else {
      await expect(
        dialog.getByText('backup-manifest.json', { exact: true }),
      ).toBeVisible();
      await expect(dialog.locator('.p-datatable-tbody > tr')).toHaveCount(3);
    }
    if (view === 'nested') {
      await Promise.all([
        page.waitForResponse(
          (response) =>
            new URL(response.url()).pathname === `/api${endpoint}` &&
            response.request().postDataJSON().path === '/etc/' &&
            response.ok(),
        ),
        dialog.getByText('etc', { exact: true }).click(),
      ]);
      await page.clock.runFor(1000);
      await expect(dialog.getByText('hostname', { exact: true })).toBeVisible();
      await expect(dialog.locator('.p-datatable-tbody > tr')).toHaveCount(2);
      await expect(
        dialog.getByRole('link', { name: 'etc', exact: true }),
      ).toBeVisible();
    }
    await expect(page.locator('.loading.active')).toHaveCount(0);
    await page.mouse.click(0, 0);
    await expect(dialog).toBeVisible();
    await expect(page).toHaveScreenshot(
      `mounted-backup-details-openstack-browse-${view}.png`,
      { fullPage: true },
    );
  });
}

for (const type of ['vm-backup', 'vm-snapshot']) {
  for (const mode of ['create', 'edit']) {
    test(`OpenStack policy form - ${type} ${mode}`, async ({ page, api }) => {
      const data = policyScheduleData('OPENSTACK', type);
      const guid = mode === 'create' ? 'create' : data.policy.guid;
      Object.assign(api, {
        '/hypervisor-clusters': data.clusters,
        '/virtual-machines': virtualMachines,
        '/backup-destinations': data.destinations,
      });
      if (type === 'vm-backup') api['/mailing-lists'] = mailingLists;
      else api['/schedules'] = [data.schedule];
      if (mode === 'edit') api[`/policies/${type}/${guid}`] = data.policy;
      await openPage(
        page,
        `/policies_and_schedules/${type}/policies/${guid}`,
        api,
      );
      await expect(page.locator('input[name="name"]')).toHaveValue(
        mode === 'create' ? '' : 'Daily backups',
      );
      if (type === 'vm-backup') api['/schedules'] = [data.schedule];
      for (const name of [
        type === 'vm-backup' ? 'Auto-assigment *' : 'Auto-assigment',
        'Virtual Environments',
        type === 'vm-backup' ? 'Rule (Default) *' : 'Rule',
        ...(type === 'vm-backup' ? ['Other'] : []),
      ]) {
        await page
          .getByRole('tab')
          .filter({ has: page.getByText(name, { exact: true }) })
          .click();
      }
      await page.clock.runFor(2000);
      await expect(
        page.getByText('Choose schedules', { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('option', { name: 'Nightly backup', exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('option', { name: 'database-production', exact: true }),
      ).toBeVisible();
      if (type === 'vm-backup') {
        await expect(
          page.getByRole('heading', { name: 'PRIMARY BACKUP DESTINATION' }),
        ).toBeVisible();
        if (mode === 'edit') {
          await expect(
            page.getByRole('heading', { name: 'SECONDARY BACKUP DESTINATION' }),
          ).toBeVisible();
          await expect(
            page.getByText('Percent of already failed EXPORT tasks', {
              exact: true,
            }),
          ).toBeVisible();
        }
      } else {
        await expect(
          page.locator('input[name="rules[0].retentionDays"]'),
        ).toHaveValue(mode === 'edit' ? '30' : '');
      }
      await expect(
        page.getByRole('button', { name: 'Save', exact: true }),
      ).toBeVisible();
      await page.mouse.click(0, 0);
      await expect(page).toHaveScreenshot(
        `policy-form-openstack-${type}-${mode}.png`,
        {
          fullPage: true,
          stylePath: `${__dirname}/fixtures/policy-schedule.css`,
        },
      );
    });

    for (const execution of ['time', 'interval']) {
      test(`OpenStack schedule form - ${type} ${mode} ${execution}`, async ({
        page,
        api,
      }) => {
        const data = policyScheduleData('OPENSTACK', type);
        const guid = mode === 'create' ? 'create' : data.schedule.guid;
        api[`/policies/${type}`] = [data.policy];
        if (mode === 'edit')
          api[`/schedules/${guid}`] = {
            ...data.schedule,
            ...(execution === 'interval'
              ? {
                  executionType: { name: 'INTERVAL', description: 'Interval' },
                  backupType: {
                    name: 'INCREMENTAL',
                    description: 'Incremental Backup',
                  },
                  hour: null,
                  startWindowLength: null,
                  interval: {
                    frequency: 3600000,
                    startHour: 21600000,
                    endHour: 79200000,
                  },
                }
              : {}),
          };
        await openPage(
          page,
          `/policies_and_schedules/${type}/schedules/${guid}`,
          api,
        );
        await expect(page.locator('input[name="name"]')).toHaveValue(
          mode === 'create' ? '' : 'Nightly backup',
        );
        if (mode === 'create' && execution === 'interval') {
          await page
            .locator('.p-dropdown')
            .filter({
              has: page.locator('.p-dropdown-label', { hasText: /^Time$/ }),
            })
            .click();
          await page
            .getByRole('option', { name: 'Interval', exact: true })
            .click();
        }
        await page.clock.runFor(2000);
        await expect(
          page.getByText(
            execution === 'interval'
              ? 'Frequency [min]'
              : 'Choose time of day for backup',
            { exact: true },
          ),
        ).toBeVisible();
        await expect(
          page.getByRole('option').filter({ hasText: 'Daily backups' }),
        ).toBeVisible();
        if (mode === 'edit') {
          await expect(
            page.getByRole('option').filter({ hasText: 'Daily backups' }),
          ).toHaveAttribute('aria-selected', 'true');
        }
        await expect(
          page.getByText('Choose Virtual Environment policies', {
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: 'Save', exact: true }),
        ).toBeVisible();
        await page.mouse.click(0, 0);
        await expect(page).toHaveScreenshot(
          `schedule-form-openstack-${type}-${mode}-${execution}.png`,
          {
            fullPage: true,
            stylePath: `${__dirname}/fixtures/policy-schedule.css`,
          },
        );
      });
    }
  }
}

for (const view of [
  'backup',
  'backup-rules',
  'restore-general',
  'restore-general-name',
  'restore-storage',
  'restore-networking',
  'restore-networking-mac',
  'restore-advanced',
  'mount-auto',
  'mount-manual',
  'mount-iscsi',
]) {
  test(`OpenStack action dialog - ${view}`, async ({ page, api }) => {
    await page.setViewportSize({ width: 1440, height: 1800 });
    const data = actionDialogData('OPENSTACK');
    api['/virtual-machines'] = [data.vm];
    await openPage(page, '/virtual_environments', api);
    Object.assign(api, data.responses, { '/backups': [data.backup] });
    const action = view.startsWith('backup')
      ? 'Backup'
      : view.startsWith('restore')
      ? 'Restore'
      : 'Mount';
    await page
      .getByRole('row')
      .filter({ hasText: 'database-production' })
      .locator('button[aria-controls="popup_menu"]')
      .click();
    await page.getByRole('menuitem', { name: action, exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.clock.runFor(2000);
    if (view.startsWith('backup')) {
      await expect(
        dialog.getByText('Retry Count', { exact: true }),
      ).toBeVisible();
      await expect(
        dialog.getByRole('button', { name: 'Select rules (1)', exact: true }),
      ).toBeVisible();
      if (view === 'backup-rules') {
        await dialog
          .getByRole('button', { name: 'Select rules (1)', exact: true })
          .click();
        await expect(
          dialog.getByText('Toggle all', { exact: true }),
        ).toBeVisible();
        await expect(
          dialog.getByText('Default', { exact: true }),
        ).toBeVisible();
      }
      if (view === 'backup-incremental') {
        await dialog.locator('.p-dropdown').click();
        await page
          .getByRole('option', { name: 'INCREMENTAL', exact: true })
          .click();
        await expect(dialog.locator('.p-dropdown-label')).toHaveText(
          'INCREMENTAL',
        );
      }
    } else if (view.startsWith('restore')) {
      await expect(
        dialog.getByText('Import to an availability zone', { exact: true }),
      ).toBeVisible();
      await expect(
        dialog
          .locator('.p-dropdown-label')
          .filter({ hasText: 'Production cluster' }),
      ).toBeVisible();
      if (view === 'restore-general-name') {
        await dialog
          .locator('.pt-3')
          .filter({
            has: page.getByText(
              'Specify name of the restored Virtual Environment',
              { exact: true },
            ),
          })
          .getByRole('button')
          .click();
        const name = dialog.locator('input[name="restoredPeName"]');
        await expect(name).toBeVisible();
        await name.fill('database-restored');
        await expect(name).toHaveValue('database-restored');
      }
      if (!view.startsWith('restore-general')) {
        const section = view.split('-')[1];
        await dialog
          .getByRole('tab')
          .filter({
            has: page.getByText(section[0].toUpperCase() + section.slice(1), {
              exact: true,
            }),
          })
          .click();
        await page.clock.runFor(1000);
        if (section === 'storage') {
          await dialog.locator('[name="restoreToOriginalVolumeType"]').click();
          await expect(
            dialog.getByRole('cell', { name: 'system.qcow2', exact: true }),
          ).toBeVisible();
        } else if (section === 'networking') {
          await expect(
            dialog.getByText('Network for interface eth0', { exact: true }),
          ).toBeVisible();
          await dialog
            .getByRole('button', { name: 'Security Groups (1)', exact: true })
            .click();
          await expect(
            dialog.getByText('Security groups in the backup', { exact: true }),
          ).toBeVisible();
          if (view === 'restore-networking-mac') {
            await dialog
              .locator('[name="restoredNetworks.0.macAddressSpecified"]')
              .click();
            const mac = dialog.locator(
              'input[name="restoredNetworks.0.macAddress"]',
            );
            await expect(mac).toBeVisible();
            await mac.fill('02:00:00:00:00:42');
            await expect(mac).toHaveValue('02:00:00:00:00:42');
          }
        } else {
          await dialog.locator('[name="isFlavorSectionActive"]').click();
          await expect(
            dialog.getByText('Flavor', { exact: true }),
          ).toBeVisible();
        }
      }
    } else {
      await expect(
        dialog.getByText('Time to auto-umount [h]', { exact: true }),
      ).toBeVisible();
      const mode =
        view === 'mount-manual'
          ? 'Specify filesytems to be mounted'
          : view === 'mount-iscsi'
          ? 'Share drives over iSCSI'
          : 'Mount filesystems automatically';
      await dialog
        .locator('.p-radiobutton')
        .filter({ has: page.getByRole('radio', { name: mode, exact: true }) })
        .locator('.p-radiobutton-box')
        .click();
      await expect(dialog.getByLabel(mode, { exact: true })).toBeChecked();
      if (view === 'mount-manual')
        await expect(
          dialog.getByText('PARAMETERS FOR MOUNTING FILESYSTEMS MANUALLY', {
            exact: true,
          }),
        ).toBeVisible();
      if (view === 'mount-iscsi')
        await expect(
          dialog.getByRole('cell', { name: 'system.qcow2', exact: true }),
        ).toBeVisible();
    }
    await page.clock.runFor(1000);
    await expect(page.locator('.loading.active')).toHaveCount(0);
    await page.mouse.click(0, 0);
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveScreenshot(
      `action-dialog-openstack-${view}.png`,
      { stylePath: `${__dirname}/fixtures/action-dialog.css` },
    );
  });
}

for (const view of [
  'backup-details',
  'backup-details-empty',
  'rule-details',
  'retention',
  'retention-archive',
  'retention-preview',
]) {
  test(`OpenStack action dialog - ${view}`, async ({ page, api }) => {
    await page.setViewportSize({ width: 1440, height: 1800 });
    const data = actionDialogData('OPENSTACK');
    Object.assign(api, data.details);
    await openPage(page, `/virtual_environments/${vmGuid}`, api);
    await page.getByRole('tab', { name: 'Backup (1)', exact: true }).click();
    Object.assign(api, data.responses);
    if (view === 'backup-details-empty')
      Object.assign(api, { '/file-systems': [], '/backup-files': [] });
    const row = page
      .getByRole('row')
      .filter({ hasText: 'Completed successfully' });
    if (view.startsWith('retention')) {
      await row.locator('.p-checkbox-box').click();
      await expect(row.getByRole('checkbox')).toBeChecked();
      await page
        .getByRole('button', { name: 'Adjust retention', exact: true })
        .click();
    } else {
      await row
        .locator(
          view === 'rule-details'
            ? 'button:has(.pi-pencil)'
            : 'button:has(.pi-search-plus)',
        )
        .click();
    }
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    if (view.startsWith('backup-details')) {
      await expect(
        dialog.getByText('FILE SYSTEMS', { exact: true }),
      ).toBeVisible();
      await expect(dialog.getByText('FILES', { exact: true })).toBeVisible();
      if (view === 'backup-details-empty')
        await expect(
          dialog.getByText('No results found', { exact: true }),
        ).toHaveCount(2);
      else
        await expect(
          dialog.getByRole('cell', { name: '/dev/sda1', exact: true }),
        ).toBeVisible();
    } else if (view === 'rule-details') {
      await expect(
        dialog.getByText('Primary storage', { exact: true }),
      ).toBeVisible();
      await expect(
        dialog.getByText('Secondary storage', { exact: true }),
      ).toBeVisible();
    } else {
      await expect(
        dialog.getByText('Retention *', { exact: true }),
      ).toBeVisible();
      if (view === 'retention-archive') {
        await dialog.locator('.p-datatable-tbody .p-dropdown').click();
        await page
          .getByRole('option', { name: 'Mark to keep', exact: true })
          .click();
        await expect(
          dialog.getByRole('button', { name: 'PreviewTable', exact: true }),
        ).toBeDisabled();
        await expect(dialog.locator('.p-calendar input')).toBeVisible();
      }
      if (view === 'retention-preview') {
        await dialog.locator('.p-datatable-tbody .p-dropdown').click();
        await page
          .getByRole('option', { name: 'Mark as expired', exact: true })
          .click();
        await dialog
          .getByRole('button', { name: 'PreviewTable', exact: true })
          .click();
        await expect(
          dialog.getByRole('columnheader', { name: 'Operation', exact: true }),
        ).toBeVisible();
        await expect(
          dialog.getByRole('cell', {
            name: 'database-production',
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          dialog.getByRole('button', { name: 'Save', exact: true }),
        ).toBeVisible();
      }
    }
    await page.clock.runFor(1000);
    await page.mouse.click(0, 0);
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveScreenshot(
      `action-dialog-openstack-${view}.png`,
      { stylePath: `${__dirname}/fixtures/action-dialog.css` },
    );
  });
}

for (const empty of [false, true]) {
  test(`OpenStack action dialog - auto-assignment preview ${
    empty ? 'empty' : 'populated'
  }`, async ({ page, api }) => {
    const data = policyScheduleData('OPENSTACK', 'vm-backup');
    Object.assign(api, {
      '/hypervisor-clusters': data.clusters,
      '/virtual-machines': virtualMachines,
      '/backup-destinations': data.destinations,
      '/mailing-lists': mailingLists,
      '/policies/vm-backup/policy-daily': data.policy,
    });
    await openPage(
      page,
      '/policies_and_schedules/vm-backup/policies/policy-daily',
      api,
    );
    api['/policies/vm-backup/policy-daily/auto-assignment-preview'] = empty
      ? []
      : [
          {
            protectedEntity: { name: 'database-production' },
            changeType: { description: 'Assign' },
            changeReason: { description: 'Matches include tag: production' },
          },
        ];
    await page
      .getByRole('tab')
      .filter({ has: page.getByText('Auto-assigment *', { exact: true }) })
      .click();
    await page.getByRole('button', { name: 'Preview', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Preview', exact: true });
    await expect(
      dialog.getByRole('cell', {
        name: empty ? 'No results found' : 'Matches include tag: production',
        exact: true,
      }),
    ).toBeVisible();
    await page.clock.runFor(1000);
    await page.mouse.click(0, 0);
    await expect(dialog).toHaveScreenshot(
      `action-dialog-openstack-auto-assignment-${
        empty ? 'empty' : 'populated'
      }.png`,
      { stylePath: `${__dirname}/fixtures/action-dialog.css` },
    );
  });
}

test('OpenStack action dialog - send report via email', async ({
  page,
  api,
}) => {
  api['/dashboard/report'] = report(false);
  await openPage(page, '/reporting/summary', api);
  await page
    .locator('.p-dropdown-label')
    .filter({ hasText: /^Export$/ })
    .click();
  await page
    .getByRole('option', { name: 'Send report via e-mail', exact: true })
    .click();
  const dialog = page.getByRole('dialog', {
    name: 'Send report via e-mail',
    exact: true,
  });
  await expect(
    dialog.getByText('E-mail recipients (comma-separated)', { exact: true }),
  ).toBeVisible();
  await dialog
    .locator('input[name="value"]')
    .fill('reports@example.test, admin@example.test');
  await page.clock.runFor(1000);
  await page.mouse.click(0, 0);
  await expect(dialog).toHaveScreenshot(
    'action-dialog-openstack-report-email.png',
    { stylePath: `${__dirname}/fixtures/action-dialog.css` },
  );
});

for (const kind of ['policies', 'schedules']) {
  for (const empty of [false, true]) {
    test(`OpenStack remaining coverage - snapshot ${kind} ${
      empty ? 'empty' : 'populated'
    }`, async ({ page, api }) => {
      const rows = (kind === 'policies' ? policies : schedules).map((row) => ({
        ...row,
        ...(kind === 'policies' ? { ruleCount: 1 } : {}),
        name: row.name.replace(/backups?/gi, 'snapshots'),
      }));
      if (kind === 'policies') api['/policies/vm-snapshot'] = empty ? [] : rows;
      else
        api['/schedules'] = (request: Request) => {
          expect(new URL(request.url()).searchParams.get('type')).toBe(
            'VM_SNAPSHOT',
          );
          return empty ? [] : rows;
        };
      const path = '/policies_and_schedules/vm-snapshot';
      await openPage(
        page,
        kind === 'policies' && !empty ? path : `${path}/${kind}`,
        api,
      );
      await expect(page).toHaveURL(new RegExp(`${path}/${kind}$`));
      await expect(
        page.getByRole('link', { name: 'Schedules', exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Create', exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('link').filter({
          has: page.getByRole('button', { name: 'Create', exact: true }),
        }),
      ).toHaveAttribute('href', `${path}/${kind}/create`);
      if (empty)
        await expect(
          page.getByText('No results found', { exact: true }),
        ).toBeVisible();
      else {
        await expect(page.locator('.p-datatable-tbody > tr')).toHaveCount(
          rows.length,
        );
        await expect(
          page.getByRole('row').filter({
            hasText:
              kind === 'policies' ? 'Daily snapshots' : 'Nightly snapshots',
          }),
        ).toBeVisible();
      }
      await expect(page).toHaveScreenshot(
        `snapshot-${kind}-openstack-${empty ? 'empty' : 'populated'}.png`,
        { fullPage: true },
      );
    });
  }
}

for (const empty of [false, true]) {
  test(`OpenStack remaining coverage - workflow expanded ${
    empty ? 'empty' : 'populated'
  }`, async ({ page, api }) => {
    await page.setViewportSize({ width: 1440, height: 1400 });
    api['/workflow-executions'] = workflows;
    await openPage(page, '/workflow_execution', api);
    api['/tasks'] = (request: Request) => {
      expect(
        new URL(request.url()).searchParams.get('workflow-execution'),
      ).toBe(workflows[0].guid);
      return empty ? [] : [tasks[0]];
    };
    const row = page
      .getByRole('row')
      .filter({ hasText: 'database-production' });
    await row.locator('.p-row-toggler').click();
    await expect(row.locator('.p-row-toggler')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    const expansion = page.locator('.p-datatable-row-expansion');
    await expect(
      expansion.getByRole('columnheader', { name: 'Node', exact: true }),
    ).toBeVisible();
    await expect(
      expansion.getByRole('cell', {
        name: empty ? 'No results found' : 'backup-node-01',
        exact: true,
      }),
    ).toBeVisible();
    await page.clock.runFor(2000);
    await page.mouse.click(0, 0);
    await expect(page).toHaveScreenshot(
      `workflow-expanded-openstack-${empty ? 'empty' : 'populated'}.png`,
      {
        fullPage: true,
        stylePath: `${__dirname}/fixtures/workflow.css`,
      },
    );
  });
}

for (const tab of ['summary', 'backups', 'restores', 'transfer-size']) {
  test(`OpenStack remaining coverage - reporting date filter ${tab}`, async ({
    page,
    api,
  }) => {
    if (tab === 'transfer-size')
      Object.assign(api, {
        '/chargeback-reporting/transfer-size/vm': sizeReport,
        '/backup-destinations': [
          { guid: 'destination-primary', name: 'Primary storage' },
        ],
        '/policies/vm-backup': policies,
        '/virtual-machines': virtualMachines,
      });
    else api['/dashboard/report'] = report(false);
    await openPage(page, `/reporting/${tab}`, api);
    await page
      .getByRole('button', { name: 'Show date filter', exact: true })
      .click();
    await expect(
      page.getByRole('button', { name: 'Hide date filter', exact: true }),
    ).toBeVisible();
    await expect(
      page
        .locator('.d-inline-block')
        .filter({ has: page.getByText('From', { exact: true }) })
        .locator('input'),
    ).toBeVisible();
    await expect(
      page
        .locator('.d-inline-block')
        .filter({ has: page.getByText('To', { exact: true }) })
        .locator('input'),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Apply', exact: true }),
    ).toBeVisible();
    await page.clock.runFor(2000);
    await page.mouse.click(0, 0);
    await expect(page).toHaveScreenshot(
      `reporting-date-filter-openstack-${tab}.png`,
      {
        fullPage: true,
        stylePath: `${__dirname}/fixtures/policy-schedule.css`,
      },
    );
  });
}

test('OpenStack remaining coverage - reporting redirect', async ({
  page,
  api,
}) => {
  api['/dashboard/report'] = report(false);
  await openPage(page, '/reporting', api);
  await expect(page).toHaveURL(/\/reporting\/summary$/);
  await expect(
    page.getByRole('link', { name: 'Summary', exact: true }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot(
    'reporting-summary-openstack-populated.png',
    { fullPage: true },
  );
});
