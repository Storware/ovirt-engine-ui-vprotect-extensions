# Screenshot tests

Each application variant has one test file and its own reference images:

| Variant | Test file | Tests | Reference directory |
| --- | --- | --- | --- |
| OpenStack | `pages.openstack.spec.ts` | 96 | `pages.openstack.spec.ts-snapshots/` |
| oVirt | `pages.ovirt.spec.ts` | 100 | `pages.ovirt.spec.ts-snapshots/` |

Both suites cover every main navigation page in the local development shell.
The reporting redirect test reuses the existing Summary reference, so each suite
has one fewer reference PNG than tests:

| Page | Reference views |
| --- | --- |
| Dashboard | Populated at 1440×1000 and 1024×1000; empty at 1440×1000 |
| Virtual environments | Populated and empty lists |
| VM details (`/virtual_environments/:guid`) | All eight tabs populated and empty; expanded OS credentials |
| Task console | Populated and empty lists |
| Workflow execution | Populated and empty lists; expanded workflow with tasks and with no tasks |
| Policies and schedules | Populated and empty policy/schedule lists for both vm-backup and vm-snapshot |
| Policy forms | Create and edit backup and snapshot policies; all accordion sections expanded; secondary storage and failure thresholds on edit |
| Schedule forms | Create and edit backup and snapshot schedules; time and interval execution |
| Mounted backups | Populated and empty lists |
| Mounted backup details (`/mounted_backups/:guid`) | Both tabs populated and empty; filesystem browser root, empty directory and subdirectory |
| Action dialogs | Backup and rule selection; Restore General, Storage, Networking (expanded security groups and custom MAC), Advanced; custom restored VM name; Mount automatic, manual and iSCSI; backup details populated/empty, rule details, retention and its archive/preview steps; auto-assignment preview populated/empty; report e-mail |
| Settings | Populated and empty mailing lists; create and edit forms |
| Reporting | Populated and empty Summary, Backup, Restore, Backup Size and Transfer Size tabs; expanded date filters on Summary, Backup, Restore and Transfer Size |

The oVirt suite also checks the dashboard staging and backup destination sections,
an expanded destination with deduplication and reduction ratio, the Hypervisor
column in the VM list, and infrastructure filters in size reports.

The standard viewport is 1440×1000; the compact dashboard is 1024×1000.
`openPage` hides the native page scrollbar before advancing chart animations.
This keeps full-page captures at the configured width and prevents repeated
scrollbar-driven chart resizes in headed runs.
VM details use 1440×1800 so their charts do not resize during full-page capture.
`fixtures/vm-details.css` hides native calendar scrollbars only while taking these
screenshots, keeping headed and headless rendering comparable. These VM captures
allow at most 30 differing pixels: the same calendar today marker produced
24 edge pixels of rasterization noise between headed and headless Chromium.
Other page screenshot tolerances are unchanged.
The populated Backup History capture allows 40 differing pixels: after the
React 18 upgrade, its two calendar today markers produce 36 edge pixels of
rasterization noise. Its reference image is unchanged.
`fixtures/policy-schedule.css` hides native page and list scrollbars during editor captures
for the same headed/headless consistency; editor pixel tolerances remain strict.
Reporting date-filter captures also use `fixtures/policy-schedule.css` to normalize
native page scrollbars. Workflow expansion uses `fixtures/workflow.css` to normalize
the virtual table scrollbar and keep column widths consistent across browser modes.
Screenshots include
the full scrollable page. VM details use the fixed GUID `64e632bd` and independent
responses for filtered backups, backup history, current snapshots and snapshot
history. The populated history assertion checks the historical snapshot UUID.
Mounted backup details use fixed mount and filesystem GUIDs. Filesystem listing
POST requests are mocked; downloads and unmount operations are not executed.
Policy and schedule forms use `/policies_and_schedules/{vm-backup,vm-snapshot}/{policies,schedules}/{create,:guid}`.
These screenshots check loaded values, rule schedules, VM choices and policy selections.
Redirects are asserted for policy/settings entry points, snapshot policies and
`/reporting` to `/reporting/summary`. Snapshot schedule list mocks assert the
`VM_SNAPSHOT` API type; expanded workflows assert the requested workflow GUID.
Save buttons are not clicked; API writes remain blocked.
The oVirt suite additionally covers incremental backup, expanded readiness reasons
and the nested Create schedule dialog. OpenStack does not offer incremental backup
for the mocked OpenStack VM. Actions that immediately submit work (Delete, Unmount,
Snapshot, task cancellation, report downloads) have no dialog and are not executed.

Mounted backup references preserve two existing display issues: filesystem Size
cells are blank because the size template reads nested fields as flat keys, and
the boolean iSCSI flag renders no text in JSX. The fixtures contain both values.

Set `build: 'OPENSTACK'` or `build: 'OVIRT'` in `src/utils/config.ts` and let the
development server rebuild. Playwright selects the matching test file and project
(`chromium-openstack` or `chromium-ovirt`) automatically. A run tests one variant.
The fixture also checks that the test's requested variant matches the source config;
variant-specific UI assertions catch a server still serving the wrong build.

Playwright reuses the application at `http://localhost:8080`, or starts it
with `yarn start --port 8080` if it is not running. In CI each matrix job selects
one variant and starts its own server; reports have separate artifact names.

API responses, login, locale, timezone and date are fixed by
`fixtures/visual-test.ts`. Shared page data lives in `fixtures/page-data.ts`;
`fixtures/ovirt-data.ts` supplies oVirt names, infrastructure and dashboard storage.
`fixtures/vm-details-data.ts` supplies VM details for both variants. Response
functions distinguish query parameters when multiple tables share an API path.
`fixtures/mounted-backup-data.ts` supplies mounted backup details and directory listings.
`fixtures/policy-schedule-data.ts` supplies editor data, destinations, retention rules
and selected schedule/policy associations for both variants.
`fixtures/action-dialog-data.ts` supplies action data and preview responses.
Restore currently reads `/openstack/restore-settings/project-restriction` in both
builds; the mocks follow that implementation and do not verify backend platform compatibility.
Action screenshots capture the dialog itself at a 1440x1800 viewport, with native
scrollbars hidden by `fixtures/action-dialog.css`. This capture-only stylesheet
also aligns dialogs to the top edge to avoid text rasterization differences
caused by fractional vertical centering. Underlying pages retain their
existing screenshot coverage.
Every `/api/` request is intercepted. Unexpected endpoints or HTTP methods
fail the test, and API arrays include the pagination count header. Read-only POSTs
for listing policies/destinations, checking incremental readiness, auto-assignment
preview and retention preview are explicitly allowed; submission endpoints remain blocked.
Browser JavaScript errors also fail the test.
No real backend credentials, records or backups are needed or changed.
The screenshots cover the local development shell, not the enclosing OpenStack
or oVirt management UI.

```bash
yarn playwright install chromium
yarn test:headless
# Run with a visible browser:
yarn test
```

Select a subset by test name:

```bash
yarn test:headless --grep 'mounted backup details'
yarn test:headless --grep 'VM details'
yarn test:headless --grep '(policy|schedule) form'
yarn test:headless --grep 'action dialog'
yarn test:headless --grep 'remaining coverage|restore-general-name|restore-networking-mac'
yarn test:headless --grep 'oVirt dashboard'
yarn test:headless --grep 'OpenStack reporting'
```

Keep reference PNGs in the corresponding `*.spec.ts-snapshots/` directories in
version control. Generate or update them only for intentional visual changes,
then review the diff. Only the currently configured variant is updated:

```bash
yarn test:update
yarn test:update --grep 'oVirt dashboard'
yarn playwright show-report
```

Playwright saves actual, expected and diff images in `test-results/` on a visual
mismatch, and an HTML report in `playwright-report/`. Run and update references
with the same Playwright version, browser and OS (Linux for the initial references).
Different platforms need their own references.

These tests cover Chromium only. The `chromium` channel uses the full browser in
both headed and headless mode, so they share reference images. The default
headless shell uses different font metrics on this system and must not be mixed
with these references.
