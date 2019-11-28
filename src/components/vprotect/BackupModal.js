import React from 'react'
import {Modal, Icon, Slider} from 'patternfly-react'
import PropTypes from 'prop-types'
import {Calendar} from 'primereact/calendar'


export class BackupModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      backupTypes: [],
      backupDestinations: [],
      task: {
        backupType: null,
        backupDestination: null,
        protectedEntities: null,
        priority: 50,
        windowStart: new Date()
      }
    }
  }

  static getDerivedStateFromProps (props, state) {
    return {
      show: props.show,
      backupTypes: props.backupTypes,
      backupDestinations: props.backupDestinations,
      task: {
        ...state.task,
        backupType: state.task.backupType || props.backupTypes[0],
        backupDestination: state.task.backupDestination || props.backupDestinations[0],
        protectedEntities: props.virtualEnvironments
      }
    }
  }

  setPriority = (value) => {
    this.setState({task: {...this.state.task, priority: JSON.parse(value)}})
  }

  render () {
    return (
      <Modal show={this.state.show} onHide={this.close}>
        <Modal.Header>
          <button
            className='close'
            aria-hidden='true'
            aria-label='Close'
            onClick={this.props.onCloseClick}
          >
            <Icon type='pf' name='close' />
          </button>
          <Modal.Title>Backup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Backup type</label>
            <select onChange={(event) => this.setState({task: {...this.state.task, backupType: JSON.parse(event.target.value)}})}>
              {this.props.backupTypes.map(el => {
                return <option key={JSON.stringify(el.name)} value={JSON.stringify(el)} >{el.description}</option>
              })}
            </select>
            <label>Backup destination</label>
            <select onChange={(event) => this.setState({task: {...this.state.task, backupDestination: JSON.parse(event.target.value)}})}>
              {this.props.backupDestinations.map(el => {
                return <option key={JSON.stringify(el.guid)} value={JSON.stringify(el)}>{el.name}</option>
              })}
            </select>
          </div>
          <div>
            <label>Priority</label>
            <Slider
              id='slider-one'
              showBoundaries
              value={this.state.task.priority}
              tooltip='show'
              input
              onSlide={this.setPriority}
            />
          </div>
          <div>
            <label>Window start</label>
            <Calendar showTime={true} hourFormat="24" value={this.state.task.windowStart} onChange={(e) => this.setState({task: {...this.state.task, windowStart: e.value}})} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={this.props.onCloseClick}>
            Cancel
          </button>
          <button onClick={() => {
            let taskWithConvertedDate = {...this.state.task, windowStart: Date.parse(this.state.task.windowStart)}
            this.props.onSaveClick(taskWithConvertedDate)
          }}>
            Backup
          </button>
        </Modal.Footer>
      </Modal>
    )
  }
}

BackupModal.propTypes = {
  virtualEnvironments: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  backupTypes: PropTypes.array.isRequired,
  backupDestinations: PropTypes.array.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired
}
