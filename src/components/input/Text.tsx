

import React, {useEffect, useState} from 'react';
import { InputText } from 'primereact/inputtext';

const Text = ({ inputValue, ...props }) => {
  let value;
  let setValue;
  [value, setValue] = useState(inputValue);

  const setFieldValueAndEmitChangeEvent = (value) => {
    setValue(value);
    if (props.change) {
      props.change({
        value,
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
