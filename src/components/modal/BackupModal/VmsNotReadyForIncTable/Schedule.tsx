import React, { useEffect, useState } from 'react';
import { schedulesService } from 'services/schedules-service';
import { VirtualMachineSchedule } from 'model/VirtualMachineSchedule';
import { Field, Form, Formik } from 'formik';
import Text from 'components/input/reactive/Text';
import Toggle from 'components/input/reactive/Toggle';
import Select from 'components/input/reactive/Select';
import Convert from 'components/input/reactive/Convert';
import Time from 'components/input/reactive/Time';
import Days from 'components/input/reactive/Days';
import SchedulePolicies from 'components/input/reactive/SchedulePolicies';
import InputListBox from 'components/input/reactive/InputListBox';
import { dayOfWeekOccurrences, months } from 'model/Occurrences';

export default ({ policy, onModelChange }) => {
  const [model, setModel] = useState(new VirtualMachineSchedule());
  useEffect(() => {
    onModelChange(model);
  }, [model]);

  const handle =
    (name) =>
    ({ target, value }) => {
      setModel({
        ...model,
        [name]: target?.nodeName === 'INPUT' ? target?.value : value,
      });
    };

  const handleIntervalValue =
    (name) =>
    ({ value }) => {
      setModel({
        ...model,
        interval: {
          ...model.interval,
          [name]: value,
        },
      });
    };

  return (
    <>
      <Formik enableReinitialize initialValues={model} onSubmit={() => {}}>
        <Form>
          <Field
            name="name"
            component={Text}
            label="Name *"
            className="col w-100"
            onChange={handle('name')}
          />

          <Field
            name="active"
            component={Toggle}
            label="Status"
            onLabel="Active"
            offLabel="Inactive"
            onChange={handle('active')}
          />

          <Field
            name="executionType"
            component={Select}
            label="Schedule execution type *"
            optionLabel="description"
            onChange={handle('executionType')}
            dataKey="name"
            className="col w-100"
            options={schedulesService.executionTypes}
          />
          {!model.interval && (
            <div>
              <Field
                name="startWindowLength"
                component={Convert}
                label="Start Window Length [min] *"
                factor={1000 * 60}
                className="col w-100"
                change={handle('startWindowLength')}
              />
              <Field
                name="hour"
                component={Time}
                label="Choose time of day for backup"
                change={handle('hour')}
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
                change={handle('frequency')}
              />
              <Field
                name="interval.startHour"
                component={Time}
                label="Choose time of interval start"
                change={handleIntervalValue('startHour')}
              />
              <Field
                name="interval.endHour"
                component={Time}
                label="Choose time of interval end"
                change={handleIntervalValue('endHour')}
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
                change={handle('daysOfWeek')}
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
                onChange={handle('dayOfWeekOccurrences')}
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
                onChange={handle('months')}
              />
            </div>
          </div>

          <Field
            name="rules"
            component={SchedulePolicies}
            label="Choose Virtual Environment policies"
            options={[policy]}
            change={handle('rules')}
          />
        </Form>
      </Formik>
    </>
  );
};
