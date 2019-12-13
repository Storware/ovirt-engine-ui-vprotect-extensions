import React from 'react'
import PropTypes from 'prop-types'
import {Dropdown} from 'primereact/dropdown'

export class DateDropdown extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      options: [],
      value: null
    }
  }

  static getDerivedStateFromProps (props, state) {
    return {
      options: props.options.map(el => {
        return {guid: el.guid, time: new Date(el.snapshotTime).toLocaleString()}
      }),
      value: state.options.filter(el => el.guid === props.value.guid)[0]
    }
  }

  render () {
    return (
      <Dropdown optionLabel='time'
        value={this.state.value}
        options={this.state.options}
        onChange={(event) => {
          this.props.onChange(this.props.options.filter(el => el.guid === event.value.guid)[0])
        }}
      />
    )
  }
}

DateDropdown.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
}
