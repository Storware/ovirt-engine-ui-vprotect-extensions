import React, { useEffect } from 'react';
import { Dropdown, DropdownProps } from 'primereact/dropdown';

interface Props extends DropdownProps {
  value: unknown;
  label: string;
}

const Select = ({ value, ...props }: Props) => {
  useEffect(() => {
    if (!props.options[0] || !props.required || value) {
      return;
    }

    const optionalValue = props.options[0];
    // @ts-ignore
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
