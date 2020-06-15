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
        setValue(new Date(props.value - offset))
    }, [field])

    return (
        <div className='pt-3'>
            {!!props.label && <label>{props.label}</label>}
            <Calendar value={value}
                      className='w-100'
                      timeOnly
                      hourFormat='24'
                      {...field}
                      {...props}
                      onChange={(e: any) => {
                          setFieldValue(e.value.getTime() + offset)
                          this.props.onChange(e.value.getTime() + offset)
                      }}
            />
        </div>
    );
}

export default Time
