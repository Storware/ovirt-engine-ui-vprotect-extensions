import {vprotectApiService} from './vprotect-api-service'
import * as moment from 'moment-timezone'
import {offset} from './time'

class SchedulesService {
  backupTypes = [
    {name: 'FULL', description: 'Full'},
    {name: 'INCREMENTAL', description: 'Incremental'}
  ];

  executionTypes = [
    {name: 'TIME', description: 'Time'},
    {name: 'INTERVAL', description: 'Interval'}
  ];

  getAllTypeSchedules (type) {
    return vprotectApiService.get('/schedules?type=' + type)
  }

  deleteSchedule (id) {
    return vprotectApiService.delete('/schedules/' + id)
  }

  getSchedule (id) {
    return vprotectApiService.get('/schedules/' + id)
  }

  createSchedule (schedule) {
    return vprotectApiService.post('/schedules', schedule)
  }

  updateSchedule (id, schedule) {
    return vprotectApiService.put('/schedules/' + id, schedule)
  }

  getScheduleTimeOrIntervalLabel (schedule) {
    switch (schedule.executionType.name) {
      case 'TIME':
        const scheduleTime = schedule.hour - offset
        return `At ${moment(scheduleTime).format('HH:mm')}`
      case 'INTERVAL':
        const frequency = Math.round(schedule.interval.frequency / 1000 / 60)
        return `Every ${frequency} minutes`
      default:
        return null
    }
  }
}

export const schedulesService = new SchedulesService()
