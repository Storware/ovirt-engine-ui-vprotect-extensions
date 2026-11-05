import { Request } from '@playwright/test';
import { GiB, mountedBackups } from './page-data';

export const mountedBackupGuid = 'mount-database';
export const fileSystemGuid = 'fs-system';

export const mountedBackup = {
  ...mountedBackups[0],
  backup: { ...mountedBackups[0].backup, size: 80 * GiB, iscsiMountable: true },
};

export const mountedFileSystems = [
  {
    guid: fileSystemGuid,
    mountPath: '/mnt/backup/system',
    fileSystem: {
      volume: '/dev/vda1',
      size: 40 * GiB,
      type: 'ext4',
      label: 'system',
    },
  },
  {
    guid: 'fs-data',
    mountPath: '/mnt/backup/data',
    fileSystem: {
      volume: '/dev/vdb1',
      size: 100 * GiB,
      type: 'xfs',
      label: 'database',
    },
  },
];

export const mountedFiles = [
  {
    guid: 'mounted-disk',
    path: '/mnt/backup/disks/system.raw',
    randomAccess: true,
  },
  {
    guid: 'mounted-config',
    path: '/mnt/backup/config/domain.xml',
    randomAccess: false,
  },
];

const entry = {
  modified: Date.parse('2026-11-03T10:00:00Z'),
  owner: 'root',
  group: 'root',
  permissions: ['OWNER_READ', 'OWNER_WRITE', 'GROUP_READ', 'OTHERS_READ'],
};
const rootEntries = [
  {
    ...entry,
    name: 'etc',
    fileType: { name: 'DIRECTORY', description: 'Directory' },
    size: 4096,
  },
  {
    ...entry,
    name: 'backup-manifest.json',
    fileType: { name: 'REGULAR_FILE', description: 'Regular file' },
    size: 2048,
  },
  {
    ...entry,
    name: 'current',
    fileType: { name: 'SYMLINK', description: 'Symbolic link' },
    size: 12,
  },
];
const nestedEntries = [
  {
    ...entry,
    name: 'hostname',
    fileType: { name: 'REGULAR_FILE', description: 'Regular file' },
    size: 24,
  },
  {
    ...entry,
    name: 'hosts',
    fileType: { name: 'REGULAR_FILE', description: 'Regular file' },
    size: 512,
  },
];

export function filesystemListing(empty: boolean) {
  return (request: Request) => {
    const { path } = request.postDataJSON();
    if (path !== '/' && path !== '/etc/') {
      throw new Error(`Unexpected filesystem directory: ${path}`);
    }
    return empty ? [] : path === '/' ? rootEntries : nestedEntries;
  };
}
