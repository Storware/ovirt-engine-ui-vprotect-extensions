import React from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'primereact/calendar';
import { offset } from '../../services/time';

export class InputDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      value:
        (props.value &&
          new Date(
            props.value - offset + new Date().getTimezoneOffset() * 60000,
          )) ||
        new Date(),
    };
  }

  render() {
    return (
      <Calendar
        showTime
        hourFormat="24"
        value={this.state.value}
        onChange={(e) => {
          this.props.onChange(
            e.value.getTime() + offset - new Date().getTimezoneOffset() * 60000,
          );
        }}
      />
    );
  }
}

InputDate.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
};
