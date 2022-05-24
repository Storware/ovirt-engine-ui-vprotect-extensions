import React, { useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';

const Select = ({ value, ...props }) => {
  useEffect(() => {
    if (!props.options[0] || !props.required || value) {
      return;
    }

    const optionalValue = props.options[0];
    props.onChange({ value: optionalValue });
  }, [props.options, value]);

  return (
    <div>
      {!!props.label && <label>{props.label}</label>}
      <Dropdown value={value} {...props} />
    </div>
  );
};

export default Select;
