import { vprotectApiService } from './vprotect-api-service';

class BackupsService {
  getBackup(id) {
    return vprotectApiService.get('/backups/' + id);
  }

  getProtectedEntityBackups(id) {
    return vprotectApiService.get('/backups?protected-entity=' + id);
  }

  getProtectedEntityRestoreJobs(id) {
    return vprotectApiService.get(`/restore-jobs?protected-entity=${id}`);
  }

  getProtectedEntityBackupsByStatus(id, status) {
    return vprotectApiService.get(
      '/backups?protected-entity=' + id + '&status=' + status,
    );
  }

  getAllMountedBackups() {
    return vprotectApiService.get('/mounted-backups');
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
}

export const backupsService = new BackupsService();
