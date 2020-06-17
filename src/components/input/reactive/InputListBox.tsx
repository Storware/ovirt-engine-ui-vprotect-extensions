import React from 'react';
import { ListBox } from 'primereact/listbox';

const InputListBox = ({ field, form: { setFieldValue }, ...props }) => {
  return (
    <div className="pt-3">
      {!!props.label && <label>{props.label}</label>}
      <ListBox {...field} {...props} />
    </div>
  );
};

export default InputListBox;
