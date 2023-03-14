import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { policiesService } from '../../services/policies-service';
import { Button } from 'primereact/button';
import { schedulesService } from '../../services/schedules-service';
import { alertService } from '../../services/alert-service';
import { Panel } from 'primereact/panel';
import { VirtualMachineSchedule } from '../../model/VirtualMachineSchedule';
import { Interval } from '../../model/Interval';
import { dayOfWeekOccurrences, months } from '../../model/Occurrences';
import { createBrowserHistory } from 'history';
import { BackButton } from '../../utils/backButton';
import { Field, Form, Formik } from 'formik';
import Text from 'components/input/reactive/Text';
import Toggle from 'components/input/reactive/Toggle';
import Convert from 'components/input/reactive/Convert';
import Time from 'components/input/reactive/Time';
import Days from 'components/input/reactive/Days';
import SchedulePolicies from 'components/input/reactive/SchedulePolicies';
import InputListBox from 'components/input/reactive/InputListBox';
import Select from 'components/input/Select';

const history = createBrowserHistory();

class VirtualEnvironmentBackupSchedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: new VirtualMachineSchedule(),
      activeIndex: [0],
      policies: [],
    };

    if (this.props.match.params.guid !== 'create') {
      schedulesService
        .getSchedule(this.props.match.params.guid)
        .then((result) => {
          this.setState({
            ...this.state,
            model: result,
          });
        });
    }

    policiesService.getPolicies('vm-backup').then((result) => {
      this.setState({
        ...this.state,
        policies: result,
      });
    });
  }

  save = async (model) => {
    if (model.guid) {
      await schedulesService.updateSchedule(model.guid, model);
      alertService.info('Schedule updated');
    } else {
      await schedulesService.createSchedule(model);
      alertService.info('Schedule created');
    }
  };

  handle = (name) => (e) => {
    this.setState({
      ...this.state,
      model: {
        ...this.state.model,
        [name]:
          e.target && e.target.nodeName === 'INPUT' ? e.target.value : e.value,
      },
    });
  };

  handleIntervalValue = (name) => (e) => {
    this.setState({
      ...this.state,
      model: {
        ...this.state.model,
        interval: {
          ...this.state.model.interval,
          [name]: e.value,
        },
      },
    });
  };

  onExecutionTypeChange(value) {
    this.setState({
      ...this.state,
      model:
        value.name === 'TIME'
          ? {
              ...this.state.model,
              executionType: value,
              hour: 36000000,
              startWindowLength: 21600000,
              interval: null,
            }
          : {
              ...this.state.model,
              executionType: value,
              hour: null,
              startWindowLength: null,
              interval: new Interval(),
            },
    });
  }

  render() {
    return (
      <Panel className="form" header="Schedule">
        <Formik
          enableReinitialize
          initialValues={this.state.model}
          onSubmit={async (values) => {
            await this.save(values);
            history.back();
          }}
        >
          <Form>
            <Field
              name="name"
              component={Text}
              label="Name *"
              onChange={this.handle('name')}
            />
            <Field
              name="active"
              component={Toggle}
              label="Status"
              onLabel="Active"
              offLabel="Inactive"
              onChange={this.handle('active')}
            />
            <Select
              value={this.state.model.backupType}
              label="Backup type *"
              isRequired={true}
              optionLabel="description"
              dataKey="name"
              options={schedulesService.backupTypes}
              onChange={this.handle('backupType')}
            />
            {this.state.model.backupType.name === 'INCREMENTAL' && (
              <div>
                Incremental backup is available only for selected platforms
              </div>
            )}

            <Select
              value={this.state.model.executionType}
              label="Schedule execution type *"
              optionLabel="description"
              onChange={({ value }) => this.onExecutionTypeChange(value)}
              dataKey="name"
              options={schedulesService.executionTypes}
            />
            {!this.state.model.interval && (
              <div>
                <Field
                  name="startWindowLength"
                  component={Convert}
                  label="Start Window Length [min] *"
                  factor={1000 * 60}
                  change={this.handle('startWindowLength')}
                />
                <Field
                  name="hour"
                  component={Time}
                  label="Choose time of day for backup"
                  change={this.handle('hour')}
                />
              </div>
            )}
            {this.state.model.interval && (
              <div>
                <Field
                  name="interval.frequency"
                  component={Convert}
                  label="Frequency [min]"
                  factor={1000 * 60}
                  change={this.handleIntervalValue('frequency')}
                />
                <Field
                  name="interval.startHour"
                  component={Time}
                  label="Choose time of interval start"
                  change={this.handleIntervalValue('startHour')}
                />
                <Field
                  name="interval.endHour"
                  component={Time}
                  label="Choose time of interval end"
                  change={this.handleIntervalValue('endHour')}
                />
              </div>
            )}

            <div className="row">
              <div className="col">
                <Field
                  name="daysOfWeek"
                  component={Days}
                  hour={this.state.model.hour}
                  label="Choose days (required)"
                  change={this.handle('daysOfWeek')}
                />
              </div>
              <div className="col">
                <Field
                  name="dayOfWeekOccurrences"
                  component={InputListBox}
                  label="Selected day of week occurrence (optional)"
                  multiple
                  optionLabel="description"
                  options={dayOfWeekOccurrences}
                  dataKey="name"
                  onChange={this.handle('dayOfWeekOccurrences')}
                />
              </div>
              <div className="col">
                <Field
                  name="months"
                  component={InputListBox}
                  label="Selected months (optional)"
                  multiple
                  optionLabel="name"
                  options={months}
                  dataKey="name"
                  onChange={this.handle('months')}
                />
              </div>
            </div>

            <Field
              name="rules"
              component={SchedulePolicies}
              label="Choose Virtual Environment policies"
              options={this.state.policies}
              change={this.handle('rules')}
            />

            <div className="d-flex justify-content-between mt-3">
              <div>
                <BackButton />
              </div>
              <div>
                <Button
                  type="submit"
                  label="Save"
                  className="p-button-success"
                  disabled={!this.state.model.name}
                />
              </div>
            </div>
          </Form>
        </Formik>
      </Panel>
    );
  }
}

VirtualEnvironmentBackupSchedule.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(VirtualEnvironmentBackupSchedule);
