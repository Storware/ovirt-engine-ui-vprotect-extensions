import React, { useEffect, useState } from 'react';
import { Chips } from 'primereact/chips';

const InputChips = ({ field, form: { setFieldValue }, ...props }) => {
  const [value, setValue] = useState(field.value || []);

  const setFieldValueAndEmitChangeEvent = ({ target: { value: val } }) => {
    setValue(val);
    setFieldValue(field.name, val);

    if (props.onChange) {
      props.onChange({ value: val });
    }
  };

  useEffect(() => {
    setValue(field.value);
  }, [field.value]);

  return (
    <div className="pt-3">
      {!!props.label && <label>{props.label}</label>}
      <Chips
        value={value}
        onChange={setFieldValueAndEmitChangeEvent}
        separator=","
        className="w-100"
      />
      <div>
        <small>Comma separated</small>
      </div>
    </div>
  );
};

export default InputChips;
