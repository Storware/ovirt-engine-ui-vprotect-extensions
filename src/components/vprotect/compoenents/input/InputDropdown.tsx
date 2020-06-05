import React, {useEffect, useState} from 'react'
import {Dropdown} from 'primereact/dropdown'

const InputDropdown = ({value, ...props}) => {
    let sourceValue
    let setSourceValue
    [sourceValue, setSourceValue] = useState()

    useEffect(() => {
      let shouldSelectFirstOption = !value && props.required
      let optionalValue = shouldSelectFirstOption ? props.options[0] : value
      setSourceValue(optionalValue);
      if(shouldSelectFirstOption) {
        props.onChange({value: optionalValue})
      }
    }, [value, props.options]);

    return (
        <div>
          {!!props.label && <label>{props.label}</label>}
          <Dropdown optionLabel='time'
                    value={sourceValue}
                    {...props}
          />
        </div>
    )
}

export default InputDropdown
