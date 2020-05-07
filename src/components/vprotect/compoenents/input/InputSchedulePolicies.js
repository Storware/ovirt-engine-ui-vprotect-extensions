import React from 'react'
import PropTypes from 'prop-types'
import {ListBox} from 'primereact/listbox'
import {Filesize} from '../convert/Filezize'

const selectedPolicies = (value, policies) => {
  let data = []
  if (!policies) {
    return []
  }
  value.forEach(rule => {
    policies.forEach(policy => {
      if (policy.rules.some(el => el.guid === rule.guid)) {
        data.push(policy)
      }
    })
  })
  return data
}

const selectedRules = (value) => {
  let data = []
  value.forEach(policy => {
    policy.rules.forEach(rule => {
      data.push(rule)
    })
  })
  return data
}

export class InputSchedulePolicies extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: null,
      shiftValue: null
    }
  }

  static getDerivedStateFromProps (props) {
    return {
      value: selectedPolicies(props.value, props.options)
    }
  }

  ruleTemplate (option) {
    return (
      <div className='p-clearfix'>
        <span>{option.name}</span> (<Filesize bytes={option.averageBackupSize} />, {option.vmCount} Virtual Environments)
      </div>
    )
  }

  render () {
    return (
      <ListBox
        value={this.state.value}
        options={this.props.options}
        multiple
        itemTemplate={this.ruleTemplate}
        dataKey='name'
        className='col w-100'
        onChange={(event) => {
          this.setState({
            ...this.state,
            value: event.value
          })
          this.props.onChange(selectedRules(event.value))
        }}
      />
    )
  }
}

InputSchedulePolicies.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
}
