import React from 'react';
import { Chips } from 'primereact/chips';

const InputChips = ({ field, form: { setFieldValue }, ...props }) => {
  return (
    <div className="pt-3">
      {!!props.label && <label>{props.label}</label>}
      <Chips {...field} {...props} separator="," className="w-100" />
      <div>
        <small>Comma separated</small>
      </div>
    </div>
  );
};

export default InputChips;
