import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPolicies } from 'store/virtual-machine/selectors';
import { Button } from 'primereact/button';
import { Field, Form, Formik } from 'formik';
import Text from 'components/input/reactive/Text';
import Toggle from 'components/input/reactive/Toggle';
import Select from 'components/input/reactive/Select';
import { useParams } from 'react-router-dom';
import { selectSchedule } from 'store/schedule/selectors';
import {
  getSchedulePage,
  save,
  setScheduleAction,
} from 'store/schedule/actions';
import { schedulesService } from 'services/schedules-service';
import Convert from 'components/input/reactive/Convert';
import Time from 'components/input/reactive/Time';
import { Interval } from 'model/Interval';
import Days from 'components/input/reactive/Days';
import InputListBox from 'components/input/reactive/InputListBox';
import { dayOfWeekOccurrences, months } from 'model/Occurrences';
import SchedulePolicies from 'components/input/reactive/SchedulePolicies';
import { Panel } from 'primereact/panel';
import { createBrowserHistory } from 'history';
import { BackButton } from 'utils/backButton';

const SnapshotSchedule = () => {
  const dispatch = useDispatch();
  const { guid } = useParams();

  const history = createBrowserHistory();

  const model = useSelector(selectSchedule);
  const policies = useSelector(selectPolicies);

  useEffect(() => {
    dispatch(getSchedulePage('VM_SNAPSHOT', guid));
  }, [guid]);

  const onExecutionTypeChange = (e) => {
    const fullExecutionType = e.value.name === 'TIME';
    dispatch(
      setScheduleAction({
        ...model,
        executionType: e.value,
        hour: fullExecutionType ? 36000000 : null,
        startWindowLength: fullExecutionType ? 21600000 : null,
        interval: fullExecutionType ? null : new Interval(),
      }),
    );
  };

  return (
    <Panel className="form" header="Schedule">
      <Formik
        enableReinitialize
        initialValues={model}
        onSubmit={async (values) => {
          await save(values);
          history.back();
        }}
      >
        <Form>
          <Field name="name" component={Text} label="Name" />
          <Field
            name="active"
            component={Toggle}
            label="Status"
            onLabel="Active"
            offLabel="Inactive"
          />
          <Field
            name="executionType"
            component={Select}
            label="Schedule execution type"
            optionLabel="description"
            change={onExecutionTypeChange}
            dataKey="name"
            options={schedulesService.executionTypes}
          />
          {!model.interval && (
            <div>
              <Field
                name="startWindowLength"
                component={Convert}
                label="Start Window Length [min]"
                factor={1000 * 60}
              />
              <Field
                name="hour"
                component={Time}
                label="Choose time of day for backup"
              />
            </div>
          )}
          {model.interval && (
            <div>
              <Field
                name="interval.frequency"
                component={Convert}
                label="Frequency [min]"
                factor={1000 * 60}
              />
              <Field
                name="interval.startHour"
                component={Time}
                label="Choose time of interval start"
              />
              <Field
                name="interval.endHour"
                component={Time}
                label="Choose time of interval end"
              />
            </div>
          )}

          <div className="row">
            <div className="col">
              <Field
                name="daysOfWeek"
                component={Days}
                hour={model.hour}
                label="Choose days (required)"
              />
            </div>
            <div className="col">
              <Field
                name="dayOfWeekOccurrences"
                component={InputListBox}
                label="Selected day of week occurrence (optional)"
                multiple
                optionLabel="name"
                options={dayOfWeekOccurrences}
                dataKey="name"
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
              />
            </div>
          </div>

          <Field
            name="rules"
            component={SchedulePolicies}
            label="Choose Virtual Environment policies"
            options={policies}
          />

          <div className="d-flex justify-content-between mt-3">
            <div>
              <BackButton />
            </div>
            <div>
              <Button type="submit" label="Save" className="p-button-success" />
            </div>
          </div>
        </Form>
      </Formik>
    </Panel>
  );
};

export default SnapshotSchedule;
