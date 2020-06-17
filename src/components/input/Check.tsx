import React from 'react';
import { Checkbox } from 'primereact/checkbox';

const Check = ({ ...props }: any) => {
  return (
    <div className="col d-flex my-2">
      <Checkbox {...props} />
      <label className="pl-2 p-checkbox-label">{props.label}</label>
    </div>
  );
};

export default Check;
