import React from 'react';
import { ListBox } from 'primereact/listbox';

const InputListBox = ({ field, ...props }) => {
  return (
    <div className="pt-3">
      {!!props.label && <label>{props.label}</label>}
      <ListBox {...field} {...props} listStyle={{ maxHeight: '250px' }} />
    </div>
  );
};

export default InputListBox;
