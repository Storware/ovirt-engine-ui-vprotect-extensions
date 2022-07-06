import { vprotectApiService } from './vprotect-api-service';
import { getDateLabel } from './time';

class BackupsService {
  getBackup(id) {
    return vprotectApiService.get('/backups/' + id);
  }

  getProtectedEntityBackups(id, params = {}) {
    return vprotectApiService.get('/backups', {
      params: {
        'protected-entity': id,
        ...params,
      },
    });
  }

  getProtectedEntityRestoreJobs(id, params = {}) {
    return vprotectApiService.get('/restore-jobs', {
      params: {
        'protected-entity': id,
        ...params,
      },
    });
  }

  getProtectedEntityBackupsByStatus(id, status) {
    return vprotectApiService.get(
      '/backups?protected-entity=' + id + '&status=' + status,
    );
  }

  getAllMountedBackups() {
    return vprotectApiService.get('/mounted-backups', {
      params: { 'finished-mount': true },
    });
  }

  getMountedBackup(id) {
    return vprotectApiService.get('/mounted-backups/' + id);
  }

  getMountedBackupFilesystemsDetailed(id) {
    return vprotectApiService.get(
      '/mounted-file-systems/detailed?mounted-backup=' + id,
    );
  }

  getMountedBackupFiles(id) {
    return vprotectApiService.get('/mounted-files?mounted-backup=' + id);
  }

  getMountedBackupFilesystemsListing(id, state) {
    return vprotectApiService.post(
      '/mounted-file-systems/' + id + '/listing',
      state,
    );
  }

  downloadBackupFilesystemsFiles(id, state) {
    return vprotectApiService.post(
      '/mounted-file-systems/' + id + '/download',
      state,
      { responseType: 'blob', observe: 'response' },
    );
  }

  getMountableBackups(id) {
    return vprotectApiService.get(
      '/backups?protected-entity=' + id + '&only-mountable=true',
    );
  }

  getBackupFileSystems(id) {
    return vprotectApiService.get('/file-systems?backup=' + id);
  }

  getBackupFiles(id) {
    return vprotectApiService.get('/backup-files?backup=' + id);
  }

  getBackupFilesDetailed(id) {
    return vprotectApiService.get('/backup-files/detailed', {
      params: {
        backup: id,
        'with-modified-configs': true,
      },
    });
  }

  getRestorableBackups(virtualMachineGuid) {
    return vprotectApiService.get(
        `/backups?protected-entity=${virtualMachineGuid}&status=SUCCESS`,
    );
  }

  async getBackupLocations(id) {
    const backupLocations = await vprotectApiService.get('/backup-locations', {
      params: {'protected-entity': id, 'location-status': 'PRESENT'},
    });
    return backupLocations.map((backupLocation) => ({
      ...backupLocation,
      name: `${getDateLabel(
        backupLocation.snapshotTime,
        'YYYY-MM-DD HH:mm:ss',
      )} (${backupLocation.backupDestination.name})`,
    }));
  }

  getHypervisorManagersAvailableForBackup(id) {
    return vprotectApiService.get(
      `/hypervisor-managers/?backup-to-be-restored=${id}`,
    );
  }

  markBackupWarningsAsKnowledged(id) {
    return vprotectApiService.put(`/backups/${id}/warnings-acknowledged`, {
      value: true,
    });
  }

  updateBackupDescription(guid = '', description = '') {
    return vprotectApiService.put(`/backups/${guid}/description`, {
      value: description,
    });
  }
}

export const backupsService = new BackupsService();
