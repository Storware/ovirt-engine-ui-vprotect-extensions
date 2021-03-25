import React from 'react';
import { InputText } from 'primereact/inputtext';

const Text = ({ field, ...props }) => (
  <div className="pt-3">
    {!!props.label && <label>{props.label}</label>}
    <InputText {...field} {...props} />
  </div>
);

export default Text;
