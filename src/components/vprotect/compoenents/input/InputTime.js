import React from 'react'
import PropTypes from 'prop-types'
import {Calendar} from 'primereact/calendar'
import {offset} from '../../services/time'

export class InputTime extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: null
    }
  }

  static getDerivedStateFromProps (props) {
    return {
      value: new Date(props.value - offset)
    }
  }

  render () {
    return (
      <Calendar value={this.state.value}
        timeOnly
        hourFormat='24'
        onChange={(e) => {
          this.props.onChange(e.value.getTime() + offset)
        }}
      />
    )
  }
}

InputTime.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
}
