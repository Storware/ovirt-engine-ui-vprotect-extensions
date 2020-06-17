import React from 'react';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';

export class InputConvert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      value: props.value / props.factor,
    };
  }

  render() {
    return (
      <InputText
        value={this.state.value}
        onChange={(event) => {
          this.props.onChange(event.target.value * this.props.factor);
        }}
      />
    );
  }
}

InputConvert.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  factor: PropTypes.number.isRequired,
};
