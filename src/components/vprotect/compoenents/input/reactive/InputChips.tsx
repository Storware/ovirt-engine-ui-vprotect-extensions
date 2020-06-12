import React from 'react'
import {Slider} from 'primereact/slider';
import {InputText} from 'primereact/inputtext';
import {Chips} from 'primereact/chips';

const InputChips = ({
                    field,
                    form: {setFieldValue},
                    ...props
                }) => {
    return (
        <div className='pt-3'>
            {!!props.label && <label>{props.label}</label>}
            <Chips {...field} {...props} />
        </div>
    );
}

export default InputChips
