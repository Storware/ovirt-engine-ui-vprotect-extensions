import React from 'react';
import { Slider } from 'primereact/slider';
import { InputText } from 'primereact/inputtext';

const InputSlider = ({ field, form: { setFieldValue }, ...props }) => {
  return (
    <div className="pt-3">
      {!!props.label && <label>{props.label}</label>}
      <InputText {...field} {...props} type="number" />
      {/*<Slider*/}
      {/*  {...field}*/}
      {/*  {...props}*/}
      {/*  onChange={(e) => {*/}
      {/*    setFieldValue(field.name, e.value);*/}
      {/*  }}*/}
      {/*/>*/}
    </div>
  );
};

export default InputSlider;
