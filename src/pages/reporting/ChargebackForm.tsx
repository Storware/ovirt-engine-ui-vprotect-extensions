import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import Select from 'components/input/reactive/Select';
import { ChargebackRequest } from 'model/chargeback/vm-chargeback-request';
import { ToggleButton } from 'primereact/togglebutton';
import { selectPropertyOptions } from 'store/chargeback-chart-form/selectors';
import {
  getPropertyOptions,
  setPropertyOptions,
} from 'store/chargeback-chart-form/actions';
import InputListBox from 'components/input/reactive/InputListBox';
import ChargebackChart from 'components/chart/ChargebackChart';
import { getChargebackData } from 'store/chargeback-chart/actions';
import config from '../../utils/config';

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

const mapPropertiesObjectListToStringOfGuids = (
  chargebackRequest: ChargebackRequest,
) => {
  return Object.keys(chargebackRequest).reduce((obj, property) => {
    return {
      ...obj,
      [property]:
        property === 'groupBy'
          ? chargebackRequest[property]
          : chargebackRequest[property].map((el) => el.guid),
    };
  }, {} as ChargebackRequest);
};

export default () => {
  const propertyOptions = useSelector(selectPropertyOptions);
  const dispatch = useDispatch();
  const chargeBackRequest = new ChargebackRequest();

  const filteredGroupByOptions = () => {
    if (config.build === 'OPENSTACK') {
      return groupByOptions.filter(item => item.value !== 'hypervisor-cluster' && item.value !== 'hypervisor-manager')
    }
    return groupByOptions
  };

  const chargeBackObjectTypeProperties = () => {
    const fieldOptions = Object.keys(filterByFieldOptions);
    if (config.build === 'OPENSTACK') {
      return fieldOptions.filter(item => item !== 'hypervisorManagerGuids' && item !== 'hypervisorClusterGuids')
    }
    return fieldOptions;
  }

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={chargeBackRequest}
        onSubmit={(values) => {
          dispatch(
            getChargebackData(mapPropertiesObjectListToStringOfGuids(values)),
          );
        }}
      >
        <Form className="mb-4">
          <Field
            name="groupBy"
            component={Select}
            options={filteredGroupByOptions()}
            valueProperty="value"
            optionLabel="label"
            required
            label="Group by"
            className="d-inline-block"
          />

          <h3>Filter</h3>

          {chargeBackObjectTypeProperties().map((el) => {
            const [show, setShow] = useState(false);
            return (
              <div>
                <label>{filterByFieldOptions[el].label}</label>
                <ToggleButton
                  checked={show}
                  onChange={({ value }) => {
                    setShow(value);
                    dispatch(
                      value
                        ? getPropertyOptions(el, propertyOptions)
                        : setPropertyOptions({ ...propertyOptions, [el]: [] }),
                    );
                  }}
                />
                {show && (
                  <Field
                    name={el}
                    component={InputListBox}
                    options={propertyOptions[el]}
                    optionLabel={filterByFieldOptions[el].optionsLabelProperty}
                    label={filterByFieldOptions[el].label}
                    multiple
                  />
                )}
              </div>
            );
          })}

          <Button
            type="submit"
            label="Generate report"
            className="p-button-success my-4"
          />
        </Form>
      </Formik>
      <div className="p-5">
        <ChargebackChart />
      </div>
    </div>
  );
};
