import React, { useEffect, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';

const Radio = ({ value, ...props }) => {
  let sourceValue;
  let setSourceValue;
  [sourceValue, setSourceValue] = useState();

  useEffect(() => {
    const shouldSelectFirstOption = !value && props.required;
    const optionalValue = shouldSelectFirstOption
      ? props.options[0].value
      : value;
    setSourceValue(optionalValue);
    if (shouldSelectFirstOption) {
      props.onChange({ value: optionalValue });
    }
  }, [value, props.options]);

  return (
    <div className="pt-3">
      {!!props.label && <label>{props.label}</label>}
      {props.options.map((el) => (
        <div className="col d-flex my-2" key={el.name}>
          <RadioButton
            value={el.value}
            inputId={el.name}
            checked={sourceValue?.name === el.value?.name}
            onChange={(e) => {
              setSourceValue(e.value);
              props.onChange({ value: e.value });
            }}
          />
          <label htmlFor={el.name} className="pl-2 p-radiobutton-label">
            {el.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Radio;
