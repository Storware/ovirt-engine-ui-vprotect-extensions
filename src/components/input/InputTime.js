import React, { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { offset } from 'services/time';
import moment from 'moment';
import { timezone } from 'services/time';
import {
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_MINUTE,
} from 'utils/milisecondsTimespan';

export const getCurrentDayMidnight = () => {
  return moment().utc().hours(0).minutes(0).second(0).millisecond(0);
};

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

export const getSourceValueFromHoursAndMinutes = (e) => {
  return (
    (e.value.getHours() * MILLISECONDS_IN_HOUR +
      e.value.getMinutes() * MILLISECONDS_IN_MINUTE +
      offset +
      MILLISECONDS_IN_DAY) %
    MILLISECONDS_IN_DAY
  );
};

export const InputTime = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(new Date());

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
