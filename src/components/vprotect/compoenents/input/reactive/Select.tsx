import React, {useEffect} from 'react'
import {Dropdown} from 'primereact/dropdown';

const Select = ({
                    field,
                    form: {setFieldValue},
                    ...props
                }) => {

    useEffect(() => {
        if (!props.options[0] || !props.required || field.value) {
            return
        }

        setFieldValue(field.name, props.options[0])
    }, [props.options, field.value]);

    return (
        <div className='pt-3'>
            {!!props.label && <label>{props.label}</label>}
            <Dropdown {...field}
                      {...props}
                      onChange={(e) => {
                          field.onChange(e)
                          if (props.change) {
                              props.change(e)
                          }
                      }} />
        </div>
    );
}

export default Select
