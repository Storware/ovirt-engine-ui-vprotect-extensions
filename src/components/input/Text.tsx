import React from 'react';
import { InputText } from 'primereact/inputtext';

const Text = ({ ...props }) => {
  return (
    <div>
      {!!props.label && <label>{props.label}</label>}
      <InputText {...props} />
    </div>
  );
};

export default Text;
