import React from 'react';
import { ListBox } from 'primereact/listbox';

const listBoxElement = (option, { optionLabel, underlinetext }) => (
  <div>
    <p style={{ marginBottom: '0 !important' }}>{option[optionLabel]}</p>
    {underlinetext && (
      <p style={{ color: 'grey', marginBottom: '0 !important' }}>
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
        itemTemplate={(e) => listBoxElement(e, props as any)}
      />
    </div>
  );
};

export default InputListBox;
