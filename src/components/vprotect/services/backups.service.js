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
}

export const backupsService = new BackupsService()
