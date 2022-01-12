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

  const setFieldValueAndEmitChangeEvent = (value) => {
    setValue(value);
    setFieldValue(field.name, viewToSourceShiftedDays(value, props.hour));
    if (props.change) {
      props.change({
        value: viewToSourceShiftedDays(value, props.hour),
      });
    }
  };

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
          setFieldValueAndEmitChangeEvent(event.value);
        }}
      />
    </div>
  );
};

export default Days;
