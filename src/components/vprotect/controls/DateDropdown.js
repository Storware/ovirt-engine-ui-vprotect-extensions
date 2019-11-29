import React from 'react'
import PropTypes from 'prop-types'
import {Dropdown} from 'primereact/dropdown'

export class DateDropdown extends React.Component {


  constructor (props) {
    super(props)
    this.state = {

    }
  }

  static getDerivedStateFromProps (props, state) {
    return {
      task: {
        ...state.task,
        protectedEntities: props.virtualEnvironments
      }
    }
  }

  componentDidUpdate (prevProps, prevState) {
  }

  onSaveClick = (task) => {
    // this.submitTask(task);
    this.props.closeModal()
  }


  static dateTemplateDropdown (option) {
    return (
      <span>{new Date(option.snapshotTime).toLocaleString()}</span>
    )
  }

  render () {
    return (
      <Dropdown optionLabel='snapshotTime'
                value={this.state.backup}
                options={this.state.backups}
                onChange={(event) => this.setState({
                  backup: event.value
                })}
                itemTemplate={DateDropdown.dateTemplateDropdown}
      />
    )
  }
}

DateDropdown.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.func.isRequired
}
