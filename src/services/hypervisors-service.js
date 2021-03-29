import { vprotectApiService } from './vprotect-api-service';

export const hypervisorManagerImportExportModes = {
  AWS: [
    {
      name: 'DISK_ATTACHMENT',
      description: 'Disk attachment to proxy VM (full)',
    },
  ],
  KUBERNETES: [
    {
      name: 'DISK_ATTACHMENT',
      description: 'Disk attachment to proxy VM (full)',
    },
  ],
  OPENSHIFT: [
    {
      name: 'DISK_ATTACHMENT',
      description: 'Disk attachment to proxy VM (full)',
    },
  ],
  OPENSTACK: [
    {
      name: 'DISK_ATTACHMENT',
      description: 'Disk attachment to proxy VM (full)',
    },
    { name: 'SSH_TRANSFER', description: 'SSH transfer' },
  ],
  ORACLE: [
    {
      name: 'DISK_ATTACHMENT',
      description: 'Disk attachment to proxy VM (full)',
    },
  ],
  NUTANIX: [
    {
      name: 'DISK_ATTACHMENT',
      description: 'Disk attachment to proxy VM (full)',
    },
  ],
  RHEV: [
    {
      name: 'DISK_ATTACHMENT',
      description: 'Disk attachment to proxy VM (full)',
    },
  ],
  RHV: [
    {
      name: 'DISK_ATTACHMENT',
      description: 'Disk attachment to proxy VM (full)',
    },
    {
      name: 'DISK_IMAGE_TRANSFER',
      description: 'Disk image transfer (full/incremental)',
    },
    { name: 'SSH_TRANSFER', description: 'SSH transfer' },
  ],
  VCENTER: [
    {
      name: 'DISK_ATTACHMENT',
      description: 'Disk attachment to proxy VM (full)',
    },
  ],
};

export const hypervisorImportExportModes = [
  {
    name: 'VM_IMAGE_PLUS_INCREMENTAL_DISKS',
    description: 'VM image (full) + separate disks (incremental)',
  },
  {
    name: 'CHANGED_BLOCK_TRACKING',
    description:
      'Separate disks (full/incremental) + Changed Block Tracking (incremental)',
  },
];

class HypervisorsService {
  getAllHypervisorManagers() {
    return vprotectApiService.get(`/hypervisor-managers`);
  }

  getAllHypervisorClusters() {
    return vprotectApiService.get('/hypervisor-clusters');
  }

  getHypervisors() {
    return vprotectApiService.get('/hypervisors');
  }

  getHypervisor(id) {
    return vprotectApiService.get('/hypervisors/' + id);
  }

  getHypervisorStoragesForHvm(id) {
    return vprotectApiService.get(
      `/hypervisor-storages?hypervisor-manager=${id}`,
    );
  }

  getHypervisorClustersForHvm(id) {
    return vprotectApiService.get(
      `/hypervisor-clusters?hypervisor-manager=${id}`,
    );
  }
}

export const hypervisorsService = new HypervisorsService();
