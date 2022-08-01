import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'primereact/dropdown';

export class BackupDropdown extends React.Component {
  static defaultProps = {
    options: [],
    value: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      options: [],
      value: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const options = props.options.map((el) => ({
      ...el,
      time: `${new Date(el.snapshotTime).toLocaleString()} ${
        el.type && el.type.name === 'FULL' ? '(Full)' : ''
      }`,
    }));
    return {
      options,
      value: props.value
        ? state.options.find((el) => el.guid === props.value.guid)
        : options[0],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      JSON.stringify(prevState.value) !== JSON.stringify(this.state.value) ||
      JSON.stringify(prevProps.value) !== JSON.stringify(this.props.value)
    ) {
      this.props.onChange(this.state.value);
    }
  }

  render() {
    return (
      <Dropdown
        optionLabel="time"
        value={this.state.value}
        required
        options={this.state.options}
        onChange={(event) => {
          this.props.onChange(
            this.props.options.filter((el) => el.guid === event.value.guid)[0],
          );
        }}
      />
    );
  }
}

BackupDropdown.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};
