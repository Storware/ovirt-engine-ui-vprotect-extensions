import React, {useState} from 'react';
import { InputText } from 'primereact/inputtext';
import { ToggleButton } from 'primereact/togglebutton';

const ToggleText= ({ field, form: { setFieldValue }, ...props }) => {

    let toggleValue
    let setValue
    [toggleValue, setValue] = useState(false)

    return (
        <div className="pt-3">
            {!!props.label && <label>{props.label}</label>}
            <ToggleButton checked={toggleValue}
                          onChange={(e) => {
                              setValue(e.value)
                              if(!e.value) {
                                  setFieldValue(field.name, null)
                              }
                          }}
            />
            {toggleValue && <div>
                {!!props.textLabel && <label>{props.textLabel}</label>}
                <InputText {...field} {...props} />
            </div>}
        </div>
    );
}

export default ToggleText;
