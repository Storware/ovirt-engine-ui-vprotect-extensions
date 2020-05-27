import {vprotectApiService} from './vprotect-api-service'

class BackupsService {
  getProtectedEntityBackups (id) {
    return vprotectApiService.get('/backups?protected-entity=' + id)
  }

  getProtectedEntityRestoreJobs (id) {
    return vprotectApiService.get(`/restore-jobs?protected-entity=${id}`)
  }

  getProtectedEntityBackupsByStatus (id, status) {
    return vprotectApiService.get('/backups?protected-entity=' + id + '&status=' + status)
  }

  getAllMountedBackups () {
    return vprotectApiService.get('/mounted-backups')
  }

  getMountedBackup (id) {
    return vprotectApiService.get('/mounted-backups/' + id)
  }
}

export const backupsService = new BackupsService()
