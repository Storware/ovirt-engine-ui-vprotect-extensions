import React from 'react';
import { ListBox } from 'primereact/listbox';

const listBoxElement = (underline) => (option) =>
  (
    <div>
      <p>{option.name}</p>
      {option[underline] && (
        <p style={{ fontSize: '0.8em', color: 'grey' }}>{option[underline]}</p>
      )}
    </div>
  );

const InputListBox = ({ field, ...props }) => {
  return (
    <div className="pt-3">
      {!!props.label && <label>{props.label}</label>}
      <ListBox
        {...field}
        {...props}
        listStyle={{ maxHeight: '250px' }}
        itemTemplate={listBoxElement(props.underlinetext)}
      />
    </div>
  );
};

export default InputListBox;
