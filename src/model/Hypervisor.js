export class Hypervisor {
  guid;
  host;
  type;
  user;
  password;
  sshKeyPath;
  node;
  vms;
  vmExportImportMode;
  transferNicAddress;
  dataCenterName;
  cluster;
  vmOwner;
  vmOwningGroup;
  hvManager;
  storageAuthKey;
  storageConfiguration;
  storageType = { name: 'DEFAULT', description: 'Default' };
}
