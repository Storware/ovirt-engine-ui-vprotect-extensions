export const backupDestinationTypes = [
  {
    name: 'SYNTHETICXFS',
    description: 'fileSystemSynthetic',
    type: 'standalone',
  },
  {
    name: 'FILESYSTEM',
    description: 'fileSystemBackupDestination',
    type: 'standalone',
  },
  {
    name: 'SYNTHETICDDBOOST',
    description: 'fileSystemDDBoost',
    type: 'standalone',
  },
  { name: 'VSTOR', description: 'catalogicVstorServer', type: 'standalone' },
  { name: 'AVAMAR', description: 'avamar', type: 'proxy' },
  { name: 'NETWORKER', description: 'dellEmcNetWorker', type: 'proxy' },
  { name: 'ISP', description: 'ibmSpectrumProtect', type: 'proxy' },
  { name: 'NETBACKUP', description: 'veritasNetBackup', type: 'proxy' },
  { name: 'S3', description: 'amazonS3', type: 'standalone' },
  { name: 'GCS', description: 'googleCloudStorage', type: 'standalone' },
  { name: 'AZURE', description: 'microsoftAzure', type: 'standalone' },
  { name: 'SWIFT', description: 'openStackSwift', type: 'standalone' },
  {
    name: 'DATAPROTECTOR',
    description: 'microFocusDataProtector',
    type: 'proxy',
  },
] as const;

export type BackupDestinationType =
  typeof backupDestinationTypes[number]['name'];

export type BackupDestinationStorageProviderType =
  | 'file-system'
  | 'object-storage'
  | 'enterprise';
