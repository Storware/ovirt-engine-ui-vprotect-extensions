import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import compare from 'utils/compare';

const Select = ({ field, form: { setFieldValue }, ...props }) => {
  const [value, setValue] = useState();

  const setFieldValueAndEmitChangeEvent = (value) => {
    setValue(value);
    setFieldValue(field.name, value);
    if (props.change) {
      props.change({
        value: value,
      });
    }
  };

  useEffect(() => {
    if (!props.options[0]) {
      return;
    }
    const option =
      field.value && props.options.find((el) => compare(field.value, el));

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
