import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';

const Convert = ({ factor, field, form: { setFieldValue }, ...props }) => {
  let value;
  let setValue;
  [value, setValue] = useState();

  const setFieldValueAndEmitChangeEvent = (value) => {
    setValue(value);
    setFieldValue(field.name, value);
    if (props.change) {
      props.change({
        value,
      });
    }
  };

  useEffect(() => {
    setValue(field.value / factor);
  }, [field]);

  return (
    <div className="pt-3">
      {!!props.label && <label>{props.label}</label>}
      <InputText
        {...field}
        {...props}
        value={value}
        onChange={(e: any) => {
          setFieldValueAndEmitChangeEvent(e.target.value * factor);
        }}
      />
    </div>
  );
};

export default Convert;
