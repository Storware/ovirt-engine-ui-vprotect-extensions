import React, {useEffect, useState} from 'react'
import {Dropdown} from 'primereact/dropdown'

const Select = ({value, ...props}) => {
    let sourceValue
    let setSourceValue
    [sourceValue, setSourceValue] = useState()

    useEffect(() => {
        if (!props.options[0] || !props.required || value) {
            return
        }

        let optionalValue = props.options[0]
        setSourceValue(optionalValue);
        props.onChange({value: optionalValue})
    }, [props.options, value]);

    return (
        <div>
            {!!props.label && <label>{props.label}</label>}
            <Dropdown value={sourceValue}
                      {...props}
            />
        </div>
    )
}

export default Select
