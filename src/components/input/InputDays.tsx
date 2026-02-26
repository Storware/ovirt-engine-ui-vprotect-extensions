import React from 'react';
import PropTypes from 'prop-types';
import { ListBox } from 'primereact/listbox';
import {
  viewToSourceShiftedDays,
  sourceToViewShiftedDays,
} from '../../services/time';
import { AdvancedDateAndTime } from '@/model/AdvancedDateAndTime';

export class InputDays extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
      sourceValue: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      value:
        state.sourceValue !== props.value
          ? sourceToViewShiftedDays(props.value, props.hour)
          : state.value,
      sourceValue: props.value,
    };
  }

  render() {
    return (
      <ListBox
        value={this.state.value}
        options={AdvancedDateAndTime.weekDays as any}
        multiple
        optionLabel="name"
        dataKey="name"
        className={'col'}
        onChange={(event) => {
          this.setState({
            ...this.state,
            value: event.value,
          });
          this.props.onChange(
            viewToSourceShiftedDays(event.value, this.props.hour),
          );
        }}
      />
    );
  }
}
 