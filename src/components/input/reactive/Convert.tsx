import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';

const Convert = ({ factor, field, form: { setFieldValue }, ...props }) => {
  let value;
  let setValue;
  [value, setValue] = useState();

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
          setFieldValue(field.name, e.target.value * factor);
        }}
      />
    </div>
  );
};

export default Convert;
