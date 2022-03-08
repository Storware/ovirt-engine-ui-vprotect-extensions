import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { compareWithValueProperty } from 'utils/compare';

const getValue = (value, valueProperty?) => {
  return valueProperty ? value[valueProperty] : value;
};

const Select = ({ field, form: { setFieldValue }, ...props }) => {
  const [value, setValue] = useState(field.value);

  const setFieldValueAndEmitChangeEvent = (v) => {
    setValue(v);
    const propertyValue = getValue(v, props.valueProperty);
    setFieldValue(field.name, propertyValue);
    if (props.change) {
      props.change({
        value: propertyValue,
      });
    }
  };

  useEffect(() => {
    if (!props.options[0]) {
      return;
    }

    const option =
      field.value &&
      props.options.find((el) =>
        compareWithValueProperty(props.valueProperty, field.value, el),
      );

    if (option) {
      setValue(option);
      return;
    }

    if (props.required) {
      setFieldValueAndEmitChangeEvent(props.options[0]);
    }
  }, [props.options, field.value]);

  return (
    <div className="pt-3">
      {!!props.label && <label>{props.label}</label>}
      <Dropdown
        {...field}
        {...props}
        value={value}
        onChange={(e) => {
          setFieldValueAndEmitChangeEvent(e.value);
        }}
      />
    </div>
  );
};

export default Select;
