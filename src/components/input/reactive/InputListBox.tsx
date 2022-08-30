import React from 'react';
import { ListBox } from 'primereact/listbox';

const listBoxElement = ({ name, uuid }) => (
  <div>
    <p>{name}</p>
    <p style={{ fontSize: '0.8em', color: 'grey' }}>{uuid}</p>
  </div>
);

const InputListBox = ({ field, ...props }) => (
  <div className="pt-3">
    {!!props.label && <label>{props.label}</label>}
    <ListBox
      {...field}
      {...props}
      listStyle={{ maxHeight: '250px' }}
      itemTemplate={listBoxElement}
    />
  </div>
);

export default InputListBox;
