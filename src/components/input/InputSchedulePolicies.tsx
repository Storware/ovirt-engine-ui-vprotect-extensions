import { ListBox } from 'primereact/listbox';
import React from 'react';
import { AdvancedFile } from '@/model/AdvancedFile';

const selectedPolicies = (value: any, policies: any) => {
  const data = [];
  if (!policies) {
    return [];
  }
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
  const data = [];
  value.forEach((policy) => {
    if (policy) {
      policy.rules.forEach((rule) => {
        data.push(rule);
      });
    }
  });
  return data;
};

export class InputSchedulePolicies extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      value: selectedPolicies(props.value, props.options),
    };
  }

  render() {
    return (
      <ListBox
        value={this.state.value}
        options={this.props.options.map((el) => ({
          ...el,
          label: (
            <span>
              {el.name} (
              <span>{AdvancedFile.formatFileSize(el.averageBackupSize)}</span>,{' '}
              {el.vmCount} Virtual Environments)
            </span>
          ),
        }))}
        optionLabel="label"
        multiple
        dataKey="guid"
        className="col w-100"
        onChange={(event) => {
          this.props.onChange(selectedRules(event.value));
        }}
      />
    );
  }
}
