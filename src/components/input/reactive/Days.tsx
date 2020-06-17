import React, { useEffect, useState } from 'react';
import { ListBox } from 'primereact/listbox';
import {
  viewToSourceShiftedDays,
  sourceToViewShiftedDays,
} from '../../../services/time';
import { daysOfWeek } from '../../../model/Occurrences';

const Days = ({ field, form: { setFieldValue }, ...props }) => {
  let value;
  let setValue;
  [value, setValue] = useState([]);

  useEffect(() => {
    setValue(
      value !== field.value
        ? sourceToViewShiftedDays(field.value, props.hour)
        : value,
    );
  }, [field.value]);

  return (
    <div className="pt-3">
      {!!props.label && <label>{props.label}</label>}
      <ListBox
        {...field}
        {...props}
        value={value}
        options={daysOfWeek}
        multiple
        optionLabel="name"
        dataKey="name"
        className={'col'}
        onChange={(event) => {
          setFieldValue(
            field.name,
            viewToSourceShiftedDays(event.value, props.hour),
          );
          setValue(event.value);
        }}
      />
    </div>
  );
};

export default Days;
