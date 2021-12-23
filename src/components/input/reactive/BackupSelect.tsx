import React, {useEffect, useState} from 'react';
import {Dropdown} from 'primereact/dropdown';
import compare from 'utils/compare';

const BackupSelect = ({field, form: {setFieldValue}, ...props}) => {
    let options
    let setOptions
    [options, setOptions] = useState([])

    useEffect(() => {
        if (!props.options[0]) {
            return;
        }

        let opt = props.options.map((el) => {
            return {
                ...el,
                time: `${new Date(el.snapshotTime).toLocaleString()} ${
                    el.type && el.type.name === 'FULL' ? '(Full)' : ''
                    }`,
            };
        });

        setOptions(opt);

        if (!props.required || (field.value && props.options.some(el => compare(field.value, el)))) {
            return;
        }

        setFieldValue(field.name, opt[0]);
        if (props.change) {
            props.change({value: opt[0]});
        }
    }, [props.options, field.value]);

    return (
        <div className="pt-3">
            {!!props.label && <label>{props.label}</label>}
            <Dropdown
                {...field}
                {...props}
                options={options}
                optionLabel="time"
                onChange={(e) => {
                    field.onChange(e);
                    if (props.change) {
                        props.change(e);
                    }
                }}
            />
        </div>
    );
};

export default BackupSelect;
