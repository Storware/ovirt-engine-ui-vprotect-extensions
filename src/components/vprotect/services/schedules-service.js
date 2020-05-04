import {vprotectApiService} from './vprotect-api-service'

class SchedulesService {
  getAllSchedules () {
    return vprotectApiService.get('/schedules')
  }
}

export const schedulesService = new SchedulesService()
