import * as moment from 'moment-timezone';
import { daysOfWeek } from '../model/Occurrences';
import { user } from '../utils/user';
import { MILLISECONDS_IN_MINUTE } from '../utils/milisecondsTimespan';

export const timezone = user && user.uiTimeZone;

export const offset =
  timezone && moment.tz(timezone).utcOffset() * MILLISECONDS_IN_MINUTE * -1;

export const shiftedDays = (value, shiftValue) => {
  return value.map((option) => {
    const daysOfWeekIndex = daysOfWeek.findIndex(
      (el) => el.name === option.name,
    );
    const index = (daysOfWeekIndex + shiftValue) % 7;
    return daysOfWeek[index === -1 ? 6 : index];
  });
};

const oneDayDuration = 1000 * 60 * 60 * 24;

export const sourceToViewShiftedDays = (value, hour) => {
  if (!value) {
    return [];
  }
  hour = hour - offset;
  const shiftValue = hour >= oneDayDuration ? 1 : hour < 0 ? -1 : 0;
  return shiftedDays(value, shiftValue);
};

export const viewToSourceShiftedDays = (value, hour) => {
  hour = hour - offset;
  const shiftValue = hour >= oneDayDuration ? -1 : hour < 0 ? 1 : 0;
  return shiftedDays(value, shiftValue);
};
