import React, {useEffect, useState} from 'react';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';

const SelectWithOther = ({field, form: {setFieldValue}, ...props}) => {
    let value
    let setValue
    [value, setValue] = useState(null)

    let options
    let setOptions
    [options, setOptions] = useState([])

    let otherOption
    let setOtherOption
    [otherOption, setOtherOption] = useState({name: 'Other', guid: '', uuid: ''})

    useEffect(() => {
        let opt = props.options.concat(otherOption)
        setOptions(opt);
        setValue(opt[0])
        setFieldValue(field.name, opt[0].uuid);
    }, [props.options]);

    return (
        <div className="pt-3">
            {!!props.label && <label>{props.label}</label>}
            <Dropdown
                {...props}
                value={value}
                options={options}
                dataKey='uuid'
                onChange={(e) => {
                    setValue(e.value)
                    setFieldValue(field.name, e.value.uuid)
                    if (props.change) {
                        props.change(e.value.uuid);
                    }
                }}
            />
            {value?.name === 'Other' && (
                <div>
                    <label>Enter Cluster ID</label>
                    <InputText
                        value={otherOption.uuid}
                        onChange={(e: any) => {
                            let value = {
                                ...otherOption,
                                uuid: e.target.value
                            }
                            setOtherOption(value)
                            setFieldValue(field.name, value.uuid)
                        }}
                    />
                </div>
            )}

        </div>
    );
};

export default SelectWithOther;
