import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { compareWithValueProperty } from 'utils/compare';

const getValue = (value, valueProperty?) =>
  valueProperty ? value[valueProperty] : value;

const Select = ({
  field,
  form: { setFieldValue },
  hidden,
  /*
   * Dropdown have problem with display information about required fields
   * so, for now, we will not provide this property to dropdown
   * and set "value" by first option element by default if !value
   */
  required = false,
  ...props
}) => {
  const [value, setValue] = useState({});

  const setFieldValueAndEmitChangeEvent = (v) => {
    setValue(v);
    const propertyValue = getValue(v, props.valueProperty);
    setFieldValue(field.name, propertyValue);
    props.onChange?.({ value: propertyValue });
  };

  useEffect(() => {
    if (!props.options[0]) {
      return;
    }

    if (required && !value) {
      setFieldValueAndEmitChangeEvent(props.options[0]);
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
  }, [props.options, field.value]);

  return (
    <div className="pt-3" hidden={hidden}>
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
