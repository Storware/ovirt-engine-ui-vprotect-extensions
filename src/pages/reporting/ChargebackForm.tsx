import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectRange, selectReport } from 'store/reporting/selectors';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import Select from 'components/input/reactive/Select';
import { ChargebackRequest } from 'model/chargeback/vm-chargeback-request';
import Toggle from 'components/input/reactive/Toggle';
import { ToggleButton } from 'primereact/togglebutton';

const groupByOptions = [
  {
    value: 'backup-destination',
    label: 'Backup Destination',
  },
  {
    value: 'backup-policy',
    label: 'Backup Policy',
  },
  {
    value: 'hypervisor-cluster',
    label: 'Cluster',
  },
  {
    value: 'hypervisor-manager',
    label: 'Hypervisor Manager',
  },
  {
    value: 'hypervisor',
    label: 'Hypervisor',
  },
  {
    value: 'virtual-machine',
    label: 'Virtual Machine',
  },
  {
    value: 'project',
    label: 'Project',
  },
];

const filterByFieldOptions = {
  backupDestinationGuids: {
    label: 'Backup destination',
    optionsLabelProperty: 'name',
  },
  backupPolicyGuids: {
    label: 'Backup Policy',
    optionsLabelProperty: 'name',
  },
  hypervisorClusterGuids: {
    label: 'Hypervisor Cluster',
    optionsLabelProperty: 'name',
  },
  hypervisorManagerGuids: {
    label: 'Hypervisor Manager',
    optionsLabelProperty: 'url',
  },
  hypervisorGuids: {
    label: 'Hypervisor',
    optionsLabelProperty: 'host',
    options: [],
  },
  virtualMachineGuids: {
    label: 'Virtual Environment',
    optionsLabelProperty: 'name',
  },
};

export default () => {
  const range = useSelector(selectRange);
  const report = useSelector(selectReport);
  const model = useSelector(selectRange);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getReport(range));
  // }, [range]);
  const chargeBackRequest = new ChargebackRequest();
  const chargeBackRequestProperties = Object.keys(chargeBackRequest);

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={model}
        onSubmit={(values) => {
          console.log(values);
          // dispatch(setRange(values));
        }}
      >
        <Form className="mb-4">
          <Field
            name="groupBy"
            component={Select}
            options={groupByOptions}
            valueProperty="value"
            optionLabel="label"
            required
            label="Group by"
            className="d-inline-block"
          />

          {chargeBackRequestProperties.map((el) => {
            const [show, setShow] = useState(false);
            return (
              <div>
                <ToggleButton
                  checked={show}
                  onChange={(e) => {
                    setShow(e.value);
                  }}
                />
                <Field name={el} component={Toggle} label="Active" />
              </div>
            );
          })}

          <Button
            type="submit"
            label="Save"
            className="p-button-success ml-4"
          />
        </Form>
      </Formik>
    </div>
  );
};
