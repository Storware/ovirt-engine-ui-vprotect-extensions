import React, {useEffect, useState} from 'react'
import {offset} from '../../../services/time'
import {Calendar} from 'primereact/calendar';

const Time = ({
                  factor,
                  field,
                  form: {setFieldValue},
                  ...props
              }) => {

    let value
    let setValue
    [value, setValue] = useState()

    useEffect(() => {
        if (field.value) {
            const date = new Date((field.value - offset + 86400000) % 86400000)
            setValue(date)
        }
    }, [field.value])

    return (
        <div className='pt-3'>
            {!!props.label && <label>{props.label}</label>}
            <Calendar
                {...field}
                {...props}
                value={value}
                className='w-100'
                timeOnly
                hourFormat='24'
                onChange={(e: any) => {
                    if (e.value instanceof Date) {
                        setFieldValue(field.name, (e.value.getTime() + offset + 86400000) % 86400000)
                    }
                    setValue(e.value)
                }}
            />
        </div>
    );
}

export default Time
