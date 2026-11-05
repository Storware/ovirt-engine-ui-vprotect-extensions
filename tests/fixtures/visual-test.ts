import { expect, Page, test as base } from '@playwright/test';
import config from '../../src/utils/config';

export type ApiResponses = Record<string, unknown>;

export const test = base.extend<{
  api: ApiResponses;
  build: 'OPENSTACK' | 'OVIRT';
}>({
  build: ['OPENSTACK', { option: true }],
  api: async ({}, use) => {
    await use({
      '/session/login': {
        login: 'visual-test',
        uiTimeZone: 'UTC',
        privileges: [
          { name: 'NODE_READ' },
          { name: 'VE_BACKUP_SLA_READ' },
          { name: 'VE_BACKUP_SLA_WRITE' },
        ],
      },
    });
  },
  page: async ({ page, api, build }, use) => {
    expect(config.build, `Visual references require the ${build} build`).toBe(
      build,
    );
    await page.clock.install({ time: new Date('2026-11-03T12:00:00Z') });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // Intercept login and every API request; never fall through to the real backend.
    await page.route('**/api/**', async (route) => {
      const request = route.request();
      const path = new URL(request.url()).pathname.replace(/^\/api/, '');
      const method =
        path === '/session/login' ||
        path.startsWith('/chargeback-reporting/') ||
        [
          '/policies/vm-backup/list-by-entities',
          '/backup-destinations/usable-for-vms',
          '/retention/mark-backups/preview',
          '/virtual-machines/incremental-not-possible',
        ].includes(path) ||
        /^\/policies\/vm-backup\/(?:[^/]+\/)?auto-assignment-preview$/.test(
          path,
        ) ||
        /^\/mounted-file-systems\/[^/]+\/listing$/.test(path)
          ? 'POST'
          : 'GET';
      if (
        !Object.prototype.hasOwnProperty.call(api, path) ||
        request.method() !== method
      ) {
        errors.push(`Unexpected API request: ${request.method()} ${path}`);
        await route.abort();
        return;
      }
      const response = api[path];
      const data =
        typeof response === 'function' ? response(request) : response;
      await route.fulfill({
        json: data,
        headers: Array.isArray(data)
          ? { 'X-Total-Count': String(data.length) }
          : {},
      });
    });

    await use(page);
    expect(errors, 'Browser errors or unexpected API requests').toEqual([]);
  },
});

export { expect };

export async function openPage(page: Page, path: string, api: ApiResponses) {
  await Promise.all([
    ...Object.keys(api).map((endpoint) =>
      page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname === `/api${endpoint}` &&
          response.ok(),
      ),
    ),
    page.goto(path),
  ]);
  // Keep full-page captures from toggling the native scrollbar and resizing charts.
  await page.addStyleTag({ content: 'html { scrollbar-width: none; }' });
  await page.evaluate(() => document.fonts.ready);
  // Advance canvas animations, debounced filters and virtual table initialization.
  await page.clock.runFor(2000);
  await expect(page.locator('.loading.active')).toHaveCount(0);
  await page.mouse.move(0, 0);
}
