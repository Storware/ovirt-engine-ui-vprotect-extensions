import React, { useEffect, useState } from 'react';
import { ListBox } from 'primereact/listbox';
import { Filesize } from '../../convert/Filesize';

const selectedPolicies = (value, policies) => {
  if (!policies || !value) {
    return [];
  }
  let data = [];
  value.forEach((rule) => {
    policies.forEach((policy) => {
      if (policy.rules.some((el) => el.guid === rule.guid)) {
        data.push(policy);
      }
    });
  });
  return data;
};

const selectedRules = (value) => {
  let data = [];
  value.forEach((policy) => {
    if (policy) {
      policy.rules.forEach((rule) => {
        data.push(rule);
      });
    }
  });
  return data;
};

const SchedulePolicies = ({ field, form: { setFieldValue }, ...props }) => {
  let value;
  let setValue;
  [value, setValue] = useState([]);

  useEffect(() => {
    setValue(selectedPolicies(field.value, props.options));
  }, [field.value, props.options]);

  return (
    <div className="pt-3">
      {!!props.label && <label>{props.label}</label>}
      <ListBox
        {...field}
        {...props}
        value={value}
        options={props.options.map((el) => {
          return {
            ...el,
            label: (
              <span>
                {el.name} (<Filesize bytes={el.averageBackupSize} />,{' '}
                {el.vmCount} Virtual Environments)
              </span>
            ),
          };
        })}
        optionLabel="label"
        multiple
        dataKey="guid"
        className="col w-100"
        onChange={(event) => {
          setFieldValue(field.name, selectedRules(event.value));
          setValue(event.value);
        }}
      />
    </div>
  );
};

export default SchedulePolicies;
