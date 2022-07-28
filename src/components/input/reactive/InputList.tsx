import { InputText } from 'primereact/inputtext';
import React from 'react';
import { Button } from 'primereact/button';

export const InputList = ({
  field,
  form: { setFieldValue },
  onChange,
  label,
  ...rest
}) => {
  const updateField = (v, id) => {
    onChange?.(v);
    setFieldValue(`${field.name}[${id}]`, v.target.value);
  };

  const deleteField = (id) => {
    const removedItemFromArr = field.value.filter((_, index) => index !== id);
    setFieldValue(field.name, removedItemFromArr);
  };

  return (
    <div className="pt-3 w-100">
      {!!label && <label>{label}</label>}
      {(field?.value || []).map((value, id) => (
        <div className="d-flex mb-3" key={id}>
          <InputText
            {...rest}
            value={value}
            onChange={(v) => updateField(v, id)}
          />
          <Button
            type="button"
            icon="pi pi-times"
            className="ml-3"
            onClick={(v) => {
              v.preventDefault();
              deleteField(id);
            }}
          />
        </div>
      ))}
    </div>
  );
};
