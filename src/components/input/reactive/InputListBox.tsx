import React from 'react';
import { ListBox } from 'primereact/listbox';

const listBoxElement = (option, { optionLabel, underlinetext }) => (
  <div>
    <div> {option[optionLabel]} </div>
    {underlinetext && (
      <div style={{ color: 'grey', fontSize: '0.8rem' }}>
        {option[underlinetext]}
      </div>
    )}
  </div>
);

const InputListBox = ({ field, ...props }) => (
  <div className="pt-3">
    {!!props.label && <label>{props.label}</label>}
    <ListBox
      {...field}
      {...props}
      itemTemplate={(e) => listBoxElement(e, props as any)}
    />
  </div>
);

export default InputListBox;
