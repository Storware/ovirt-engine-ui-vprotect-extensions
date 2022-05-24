import React from 'react';
import { InputText } from 'primereact/inputtext';
import { ToggleButton } from 'primereact/togglebutton';

const Toggle = ({ field, form: { touched, errors }, ...props }) => (
  <div className="pt-3">
    {!!props.label && <label>{props.label}</label>}
    <ToggleButton
      className="ml-2"
      {...field}
      {...props}
      checked={field.value}
    />
    {/* {touched[field.name] &&*/}
    {/* errors[field.name] && <div className="error">{errors[field.name]}</div>}*/}
  </div>
);

export default Toggle;
