import React from 'react';
import { ListBox } from 'primereact/listbox';

const listBoxElement = (option, { optionLabel, underlinetext }) => (
  <div>
    <p style={{ marginBottom: 0 }}>{option[optionLabel]}</p>
    {underlinetext && (
      <p style={{ fontSize: '1em', color: 'grey',  marginBottom: 0 }}>
        {option[underlinetext]}
      </p>
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
        itemTemplate={(e) => listBoxElement(e, props as any)}
      />
    </div>
  );
};

export default InputListBox;
