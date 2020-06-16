import React from 'react'
import {
  withRouter,
  Link
} from 'react-router-dom'
import PropTypes from 'prop-types'
import {policiesService} from '../../../services/policies-service'
import {InputText} from 'primereact/inputtext'
import {ToggleButton} from 'primereact/togglebutton'
import {Dropdown} from 'primereact/dropdown'
import {Button} from 'primereact/button'
import {schedulesService} from '../../../services/schedules-service'
import {alertService} from '../../../services/alert-service'
import {InputConvert} from '../../../compoenents/input/InputConvert'
import {Panel} from 'primereact/panel'
import {InputTime} from '../../../compoenents/input/InputTime'
import {VirtualMachineSchedule} from '../../../model/VirtualMachineSchedule'
import {Interval} from '../../../model/Interval'
import {InputDays} from '../../../compoenents/input/InputDays'
import {ListBox} from 'primereact/listbox'
import {dayOfWeekOccurrences, months} from '../../../model/Occurrences'
import {InputSchedulePolicies} from '../../../compoenents/input/InputSchedulePolicies'

class VirtualEnvironmentBackupSchedule extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      model: new VirtualMachineSchedule(),
      activeIndex: [0],
      policies: []
    }

    if (this.props.match.params.guid !== 'create') {
      schedulesService.getSchedule(this.props.match.params.guid).then(result => {
        this.setState({
          ...this.state,
          model: result
        })
      })
    }

    policiesService.getPolicies('vm-backup').then(result => {
      this.setState({
        ...this.state,
        policies: result
      })
    })
  }

  save = async () => {
    if (this.state.model.guid) {
      await schedulesService.updateSchedule(this.state.model.guid, this.state.model)
      alertService.info('Schedule updated')
    } else {
      await schedulesService.createSchedule(this.state.model)
      alertService.info('Schedule created')
    }
  }

  onExecutionTypeChange (value) {
    this.setState({
      ...this.state,
      model: value.name === 'TIME' ? {
        ...this.state.model,
        executionType: value,
        hour: 36000000,
        startWindowLength: 21600000,
        interval: null
      } : {
        ...this.state.model,
        executionType: value,
        hour: null,
        startWindowLength: null,
        interval: new Interval()
      }
    })
  }

  render () {
    return (
      <Panel className={'form'} header='Schedule'>
        <div>
          <h3>Name</h3>
          <InputText value={this.state.model.name} onChange={(e) => {
            this.setState({
              ...this.state,
              model: {
                ...this.state.model,
                name: e.target.value
              }
            })
          }} />
        </div>
        <div>
          <h3>Active</h3>
          <ToggleButton checked={this.state.model.active} onChange={(e) => {
            this.setState({
              ...this.state,
              model: {
                ...this.state.model,
                active: e.value
              }
            })
          }} />
        </div>
        <div>
          <h3>Backup type</h3>
          <Dropdown value={this.state.model.backupType}
            optionLabel='description'
            dataKey='name'
            options={schedulesService.backupTypes} onChange={(e) => {
            this.setState({
              ...this.state,
              model: {
                ...this.state.model,
                backupType: e.value
              }
            })
          }} />
          {this.state.model.backupType.name === 'INCREMENTAL' && <div>
            Incremental backup is available only for selected platforms
          </div>}
        </div>
        <div>
          <h3>Schedule execution type</h3>
          <Dropdown value={this.state.model.executionType}
            optionLabel='description'
            dataKey='name'
            options={schedulesService.executionTypes}
            onChange={(e) => {
              this.onExecutionTypeChange(e.value)
            }} />
        </div>
        {!this.state.model.interval && <div>
          <div>
            <h3>Start Window Length [min]</h3>
            <InputConvert value={this.state.model.startWindowLength}
              factor={1000 * 60}
              onChange={(e) => {
              this.setState({
                ...this.state,
                model: {
                  ...this.state.model,
                  startWindowLength: e
                }
              })
            }} />
          </div>
          <div>
            <h3>Choose time of day for backup</h3>
            <InputTime value={this.state.model.hour}
              onChange={(e) => {
              this.setState({
                ...this.state,
                model: {
                  ...this.state.model,
                  hour: e
                }
              })
            }}
            />
          </div>
        </div>}
        {this.state.model.interval && <div>
          <div>
            <h3>Frequency [min]</h3>
            <InputConvert value={this.state.model.interval.frequency}
              factor={1000 * 60}
              onChange={(e) => {
                this.setState({
                  ...this.state,
                  model: {
                    ...this.state.model,
                    interval: {
                      ...this.state.model.interval,
                      frequency: e
                    }
                  }
                })
              }} />
          </div>
          <div>
            <h3>Choose time of interval start</h3>
            <InputTime value={this.state.model.interval.startHour}
              onChange={(e) => {
               this.setState({
                 ...this.state,
                 model: {
                   ...this.state.model,
                   interval: {
                     ...this.state.model.interval,
                     startHour: e
                   }
                 }
               })
              }}
            />
          </div>
          <div>
            <h3>Choose time of interval end</h3>
            <InputTime value={this.state.model.interval.endHour}
              onChange={(e) => {
               this.setState({
                 ...this.state,
                 model: {
                   ...this.state.model,
                   interval: {
                     ...this.state.model.interval,
                     endHour: e
                   }
                 }
               })
              }}
            />
          </div>
        </div>}
        <div className='row'>
          <div className='col'>
            <h3>Choose days (required)</h3>
            <InputDays
              value={this.state.model.daysOfWeek}
              hour={this.state.model.hour}
              onChange={(e) => {
                this.setState({
                  ...this.state,
                  model: {
                    ...this.state.model,
                    daysOfWeek: e
                  }
                })
              }} />
          </div>
          <div className='col'>
            <h3>Selected day of week occurrence (optional)</h3>
            <ListBox multiple
              optionLabel='name'
              dataKey='name'
              value={this.state.model.dayOfWeekOccurrences}
              options={dayOfWeekOccurrences}
              onChange={(e) => {
               this.setState({
                 ...this.state,
                 model: {
                   ...this.state.model,
                   dayOfWeekOccurrences: e.value
                 }
               })
              }} />
          </div>
          <div className='col'>
            <h3>Selected months (optional)</h3>
            <ListBox multiple
              optionLabel='name'
              dataKey='name'
              value={this.state.model.months}
              options={months}
              onChange={(e) => {
               this.setState({
                 ...this.state,
                 model: {
                   ...this.state.model,
                   months: e.value
                 }
               })
              }} />
          </div>
        </div>
        <div>
          <h3>Choose Virtual Environment policies</h3>
          <InputSchedulePolicies multiple
            value={this.state.model.rules}
            options={this.state.policies}
            onChange={(e) => {
             this.setState({
               ...this.state,
               model: {
                 ...this.state.model,
                 rules: e
               }
             })
            }}
          />
        </div>
        <div className='d-flex justify-content-between mt-3'>
          <div>
            <Link to={`/schedules/list/VM_BACKUP`}>
              <Button label='Back' />
            </Link>
          </div>
          <div>
            <Button label='Save' className='p-button-success' onClick={this.save} />
          </div>
        </div>
      </Panel>
    )
  }
}

VirtualEnvironmentBackupSchedule.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(VirtualEnvironmentBackupSchedule)
