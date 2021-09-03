import React, { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import {
  getHoursAndMinutesFromSource,
  getSourceValueFromHoursAndMinutes,
} from 'components/input/InputTime';

const Time = ({ factor, field, form: { setFieldValue }, ...props }) => {
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    if (field.value !== undefined) {
      setValue(getHoursAndMinutesFromSource(field.value));
    }
  }, [field.value]);

  return (
    <div className="pt-3">
      {!!props.label && <label>{props.label}</label>}
      <Calendar
        {...field}
        {...props}
        value={value}
        className="w-100"
        timeOnly
        hourFormat="24"
        onChange={(e: any) => {
          if (e.value instanceof Date) {
            setFieldValue(field.name, getSourceValueFromHoursAndMinutes(e));
          } else {
            setValue(e.value);
          }
        }}
      />
    </div>
  );
};

export default Time;
