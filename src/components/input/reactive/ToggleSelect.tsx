import React, { useState } from 'react';
import { ToggleButton } from 'primereact/togglebutton';
import Select from './Select';

const ToggleSelect = ({ field, form, label, textLabel, ...props }) => {
  const [toggleValue, setValue] = useState(false);

  return (
    <div className="pt-3">
      {!!label && <label>{label}</label>}
      <ToggleButton
        className="ml-2"
        checked={toggleValue}
        onChange={(e) => {
          setValue(e.value);
          if (!e.value) {
            props.field?.setFieldValue(props.field.name, null);
          }

          if (props.toggle) {
            props.toggle(e);
          }
        }}
      />
      {toggleValue && (
        <Select field={field} form={form} label={textLabel} {...props} />
      )}
    </div>
  );
};

export default ToggleSelect;
