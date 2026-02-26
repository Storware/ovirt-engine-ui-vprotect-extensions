import * as moment from 'moment-timezone';
import { timezone } from '../services/time';

export class AdvancedDateAndTime {
  static readonly MILLISECONDS_IN_MINUTE = 60 * 1000;
  static readonly MILLISECONDS_IN_HOUR =
    60 * AdvancedDateAndTime.MILLISECONDS_IN_MINUTE;
  static readonly MILLISECONDS_IN_DAY =
    24 * AdvancedDateAndTime.MILLISECONDS_IN_HOUR;

  static readonly weekDays = [
    { shortName: 'Mo', name: 'MONDAY' },
    { shortName: 'Tu', name: 'TUESDAY' },
    { shortName: 'We', name: 'WEDNESDAY' },
    { shortName: 'Th', name: 'THURSDAY' },
    { shortName: 'Fr', name: 'FRIDAY' },
    { shortName: 'Sa', name: 'SATURDAY' },
    { shortName: 'Su', name: 'SUNDAY' },
  ] as const;

  static readonly months = [
    { shortName: 'Jan', name: 'JANUARY' },
    { shortName: 'Feb', name: 'FEBRUARY' },
    { shortName: 'Mar', name: 'MARCH' },
    { shortName: 'Apr', name: 'APRIL' },
    { shortName: 'May', name: 'MAY' },
    { shortName: 'Jun', name: 'JUNE' },
    { shortName: 'Jul', name: 'JULY' },
    { shortName: 'Aug', name: 'AUGUST' },
    { shortName: 'Sep', name: 'SEPTEMBER' },
    { shortName: 'Oct', name: 'OCTOBER' },
    { shortName: 'Nov', name: 'NOVEMBER' },
    { shortName: 'Dec', name: 'DECEMBER' },
  ];

  static legacyFormat(date) {
    try {
      return moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    } catch (error) {
      return '';
    }
  }

  static convertMillisecondsToFormattedHours(miliseconds: number): string {
    let seconds = miliseconds / 1000;
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    const time = (n) => (n < 10 ? `0${n}` : n);
    return `${time(hours)}:${time(minutes)}:${time(seconds)}`;
  }
}
