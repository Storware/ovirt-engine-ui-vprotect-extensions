import React from 'react'
import PropTypes from 'prop-types'
import {ListBox} from 'primereact/listbox'
import {daysOfWeek} from '../../model/Occurrences'
import {viewToSourceShiftedDays, sourceToViewShiftedDays} from '../../services/time'

export class InputDays extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: null,
      sourceValue: null
    }
  }

  static getDerivedStateFromProps (props, state) {
    console.log(state)
    console.log(props)
    return {
      value: state.sourceValue !== props.value ? sourceToViewShiftedDays(props.value, props.hour) : state.value,
      sourceValue: props.value
    }
  }

  render () {
    return (
      <ListBox
        value={this.state.value}
        options={daysOfWeek}
        multiple
        optionLabel='name'
        dataKey='name'
        className={'col'}
        onChange={(event) => {
          this.setState({
            ...this.state,
            value: event.value
          })
          this.props.onChange(viewToSourceShiftedDays(event.value, this.props.hour))
        }}
      />
    )
  }
}

InputDays.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  hour: PropTypes.number.isRequired
}
