import { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';
import { offset } from '@/services/time';
import { timezone } from '@/services/time';
import { AdvancedDateAndTime } from '@/model/AdvancedDateAndTime';

export const getCurrentDayMidnight = () =>
  moment().utc().hours(0).minutes(0).second(0).millisecond(0);

export const getHoursAndMinutesFromSource = (value) => {
  const momentDate = moment.tz(
    getCurrentDayMidnight().valueOf() + value,
    timezone,
  );
  const date = new Date();
  date.setHours(momentDate.hour());
  date.setMinutes(momentDate.minutes());
  return date;
};

export const getSourceValueFromHoursAndMinutes = (e) =>
  (e.value.getHours() * AdvancedDateAndTime.MILLISECONDS_IN_HOUR +
    e.value.getMinutes() * AdvancedDateAndTime.MILLISECONDS_IN_MINUTE +
    offset +
    AdvancedDateAndTime.MILLISECONDS_IN_DAY) %
  AdvancedDateAndTime.MILLISECONDS_IN_DAY;

export const InputTime = ({ value, onChange }: any) => {
  const [inputValue, setInputValue] = useState<any>(new Date());

  useEffect(() => {
    setInputValue(getHoursAndMinutesFromSource(value));
  }, [value]);

  return (
    <Calendar
      value={inputValue}
      className="w-100"
      timeOnly
      hourFormat="24"
      onChange={(e) => {
        if (e.value instanceof Date) {
          onChange(getSourceValueFromHoursAndMinutes(e));
        } else {
          setInputValue(e.value);
        }
      }}
    />
  );
};
