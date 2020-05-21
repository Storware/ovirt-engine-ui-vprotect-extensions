import * as moment from 'moment-timezone'
import {daysOfWeek} from '../model/Occurrences'

export const timezone = JSON.parse(localStorage.getItem('user')).uiTimeZone

export const offset = (moment.tz.zone(timezone).parse(Date.UTC(moment().year(), moment().month(), moment().date(), 0, 0)) + 60) * 60 * 1000

export const shiftedDays = (value, shiftValue) => {
  return value.map(option => {
    const daysOfWeekIndex = daysOfWeek.findIndex(el => el.name === option.name)
    const index = (daysOfWeekIndex + shiftValue) % 7
    return daysOfWeek[index === -1 ? 6 : index]
  })
}

const oneDayDuration = 1000 * 60 * 60 * 24

export const sourceToViewShiftedDays = (value, hour) => {
  hour = hour - offset
  const shiftValue = hour >= oneDayDuration ? 1 : hour < 0 ? -1 : 0
  return shiftedDays(value, shiftValue)
}

export const viewToSourceShiftedDays = (value, hour) => {
  hour = hour - offset
  const shiftValue = hour >= oneDayDuration ? -1 : hour < 0 ? 1 : 0
  return shiftedDays(value, shiftValue)
}
