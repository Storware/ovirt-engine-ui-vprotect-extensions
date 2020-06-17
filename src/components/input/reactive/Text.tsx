import React from 'react';
import { InputText } from 'primereact/inputtext';

const Text = ({ field, form: { touched, errors }, ...props }) => (
  <div className="pt-3">
    {!!props.label && <label>{props.label}</label>}
    <InputText {...field} {...props} />
    {/*{touched[field.name] &&*/}
    {/*errors[field.name] && <div className="error">{errors[field.name]}</div>}*/}
  </div>
);

export default Text;
