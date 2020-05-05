import {vprotectApiService} from './vprotect-api-service'
import * as moment from 'moment-timezone'

class SchedulesService {
  daysOfWeek = [
    {shortName: 'Mo', name: 'MONDAY'},
    {shortName: 'Tu', name: 'TUESDAY'},
    {shortName: 'We', name: 'WEDNESDAY'},
    {shortName: 'Th', name: 'THURSDAY'},
    {shortName: 'Fr', name: 'FRIDAY'},
    {shortName: 'Sa', name: 'SATURDAY'},
    {shortName: 'Su', name: 'SUNDAY'}
  ]

  months = [
    {shortName: 'Jan', name: 'JANUARY'},
    {shortName: 'Feb', name: 'FEBRUARY'},
    {shortName: 'Mar', name: 'MARCH'},
    {shortName: 'Apr', name: 'APRIL'},
    {shortName: 'May', name: 'MAY'},
    {shortName: 'Jun', name: 'JUNE'},
    {shortName: 'Jul', name: 'JULY'},
    {shortName: 'Aug', name: 'AUGUST'},
    {shortName: 'Sep', name: 'SEPTEMBER'},
    {shortName: 'Oct', name: 'OCTOBER'},
    {shortName: 'Nov', name: 'NOVEMBER'},
    {shortName: 'Dec', name: 'DECEMBER'}
  ]

  dayOfWeekOccurrences = [
    {shortName: '1st', name: 'FIRST_IN_MONTH'},
    {shortName: '2nd', name: 'SECOND_IN_MONTH'},
    {shortName: '3rd', name: 'THIRD_IN_MONTH'},
    {shortName: '4th', name: 'FOURTH_IN_MONTH'},
    {shortName: 'Last', name: 'LAST_IN_MONTH'}
  ]

  months = [
    {name: 'JANUARY'},
    {name: 'FEBRUARY'},
    {name: 'MARCH'},
    {name: 'APRIL'},
    {name: 'MAY'},
    {name: 'JUNE'},
    {name: 'JULY'},
    {name: 'AUGUST'},
    {name: 'SEPTEMBER'},
    {name: 'OCTOBER'},
    {name: 'NOVEMBER'},
    {name: 'DECEMBER'}
  ]

  backupTypes = [
    {name: 'FULL', description: 'Full'},
    {name: 'INCREMENTAL', description: 'Incremental'}
  ];

  executionTypes = [
    {name: 'TIME', description: 'time'},
    {name: 'INTERVAL', description: 'interval'}
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

  getScheduleTimeOrIntervalLabel (schedule) {
    switch (schedule.executionType.name) {
      case 'TIME':
        const userTimeZone = JSON.parse(localStorage.getItem('user')).uiTimeZone
        const scheduleTime = moment.tz(Date.UTC(moment().year(), moment().month(), moment().date(), 0, 0) + schedule.hour, userTimeZone)
        return `At ${moment(scheduleTime).format('HH:mm')}`
      case 'INTERVAL':
        const frequency = Math.round(schedule.interval.frequency / 1000 / 60)
        return `Every ${frequency} minutes`
      default:
        return null
    }
  }

  getHourAndMinute (time, userTimeZone) {
    const backupTime = moment.tz(Date.UTC(moment().year(), moment().month(), moment().date(), 0, 0) + time, userTimeZone)
    return {
      hour: backupTime.hours(),
      minute: backupTime.minutes()
    }
  }

  getTranslatedDays (schedule) {
    const zone = moment.tz.zone(JSON.parse(localStorage.getItem('user')).uiTimeZone)
    const offset = zone.parse(Date.UTC(moment().year(), moment().month(), moment().date(), 0, 0))
    let hour = schedule.interval ? schedule.interval.startHour : schedule.hour
    const time = this.getHourAndMinute(hour, JSON.parse(localStorage.getItem('user')).uiTimeZone)
    hour = (time.hour * (60 * 60000)) + (time.minute * 60000) + (offset * 60000)
    const oneDayDuration = 1000 * 60 * 60 * 24
    if (hour >= oneDayDuration) {
      return this.shiftDaysFromList(schedule.daysOfWeek, this.daysOfWeek, -1)
    } else if (hour < 0) {
      return this.shiftDaysFromList(schedule.daysOfWeek, this.daysOfWeek, +1)
    }
    return schedule.daysOfWeek
  }

  shiftDaysFromList (days, list, shift) {
    let result = []
    for (let i = 0, l = list.length; i < l; i++) {
      const day = days.find((el) => {
        return el.name === list[i].name
      })
      if (day) {
        if (i === 0 && shift === -1) {
          result.push(list[6])
        } else if (shift === -1) {
          result.push(list[i - 1])
        } else if (i === 6 && shift === 1) {
          result.push(list[0])
        } else if (shift === 1) {
          result.push(list[i + 1])
        }
      }
    }
    return result
  }
}

export const schedulesService = new SchedulesService()
