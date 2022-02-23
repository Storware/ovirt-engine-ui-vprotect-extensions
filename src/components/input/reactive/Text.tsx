import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';

const getValue = (value, valueProperty?) => {
  return valueProperty ? value[valueProperty] : value;
};

const Text = ({ field, form: { setFieldValue }, ...props }) => {
  const [value, setValue] = useState(field.value || '');

  const setFieldValueAndEmitChangeEvent = ({ target: { value: val } }) => {
    setValue(val);
    const propertyValue = getValue(val, props.valueProperty);
    setFieldValue(field.name, propertyValue);
    if (props.change) {
      props.change({
        value: propertyValue,
      });
    }
  };

  useEffect(() => {
    if (field.value) {
      setValue(field.value);
    }
  }, [field.value]);

  return (
    <div className="pt-3">
      {!!props.label && <label>{props.label}</label>}
      <InputText
        {...field}
        {...props}
        value={value}
        onChange={setFieldValueAndEmitChangeEvent}
      />
    </div>
  );
};

export default Text;
