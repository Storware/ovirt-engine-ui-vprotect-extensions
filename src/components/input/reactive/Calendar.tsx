import React, { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { offset } from 'services/time';

export default ({ field, form: { setFieldValue }, ...props }) => {
  let value;
  let setValue;
  [value, setValue] = useState();

  useEffect(() => {
    setValue((field.value && new Date(field.value - offset)) || new Date());
  }, [field]);

  return (
    <div className={props.className} >
      {props.label && <label className={"mr-2"}>{props.label}</label>}
      <Calendar
        showTime
        hourFormat="24"
        value={value}
        onChange={(e) => {
          setValue(e.value);
          // @ts-ignore
          setFieldValue(field.name, e.value.getTime() + offset);
        }}
      />
    </div>
  );
};
