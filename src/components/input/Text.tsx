import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';

const Text = ({
  inputValue,
  change,
  ...props
}: {
  change?: (event: { value: string }) => void;
  [key: string]: unknown;
}) => {
  let value;
  let setValue;
  [value, setValue] = useState(inputValue);

  const setFieldValueAndEmitChangeEvent = (v) => {
    setValue(v);
    if (change) {
      change({
        value: v,
      });
    }
  };

  useEffect(() => {
    setValue(inputValue);
  }, [inputValue]);

  return (
    <div>
      {!!props.label && <label>{props.label}</label>}
      <InputText
        {...props}
        value={value}
        onChange={(e: any) => {
          setFieldValueAndEmitChangeEvent(e.target.value);
        }}
      />
    </div>
  );
};

export default Text;
