import React, { useEffect, useState } from 'react';
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
import isNotOpenstackBuild from 'utils/isNotOpenstackBuild';
import { selectRange } from 'store/reporting/selectors';

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
    value: 'hypervisor',
    label: 'Hypervisor',
  },
  {
    value: 'virtual-machine',
    label: 'Virtual Machine',
  },
  ...(isNotOpenstackBuild
    ? [
        {
          value: 'hypervisor-cluster',
          label: 'Cluster',
        },
        {
          value: 'hypervisor-manager',
          label: 'Hypervisor Manager',
        },
      ]
    : []),
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
  hypervisorGuids: {
    label: 'Hypervisor',
    optionsLabelProperty: 'host',
    options: [],
  },
  virtualMachineGuids: {
    label: 'Virtual Environment',
    optionsLabelProperty: 'name',
  },
  ...(isNotOpenstackBuild && {
    hypervisorClusterGuids: {
      label: 'Hypervisor Cluster',
      optionsLabelProperty: 'name',
    },
    hypervisorManagerGuids: {
      label: 'Hypervisor Manager',
      optionsLabelProperty: 'url',
    },
  }),
};

const mapPropertiesObjectListToStringOfGuids = (
  chargebackRequest: ChargebackRequest,
) =>
  Object.keys(chargebackRequest).reduce(
    (obj, property) => ({
      ...obj,
      [property]:
        property === 'groupBy'
          ? chargebackRequest[property]
          : chargebackRequest[property].map((el) => el.guid),
    }),
    {} as ChargebackRequest,
  );

export default () => {
  const propertyOptions = useSelector(selectPropertyOptions);
  const dispatch = useDispatch();
  const chargeBackRequest = new ChargebackRequest();
  const range = useSelector(selectRange);

  useEffect(() => {
    dispatch(
      getChargebackData(
        range,
        mapPropertiesObjectListToStringOfGuids(chargeBackRequest),
      ),
    );
  }, [range]);

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={chargeBackRequest}
        onSubmit={(values) => {
          dispatch(
            getChargebackData(
              range,
              mapPropertiesObjectListToStringOfGuids(values),
            ),
          );
        }}
      >
        {(props) => (
          <Form className="mb-4">
            <Field
              name="groupBy"
              component={Select}
              options={groupByOptions}
              optionLabel="label"
              label="Group by"
              className="w-100"
              placeholder="Choose an option"
            />

            <b
              style={{
                fontSize: '1.25rem',
                display: 'block',
                marginTop: '1.5rem',
              }}
            >
              Filters
            </b>

            {Object.keys(filterByFieldOptions).map((key) => {
              const [show, setShow] = useState(false);
              return (
                <div className="mt-2" key={key}>
                  <label>{filterByFieldOptions[key].label}</label>
                  <ToggleButton
                    className="ml-2"
                    checked={show}
                    onChange={({ value }) => {
                      setShow(value);
                      dispatch(
                        value
                          ? getPropertyOptions(key, propertyOptions)
                          : setPropertyOptions({
                              ...propertyOptions,
                              [key]: [],
                            }),
                      );

                      if (!value) {
                        props.setFieldValue(key, []);
                      }
                    }}
                  />
                  {show && (
                    <Field
                      name={key}
                      component={InputListBox}
                      options={propertyOptions[key]}
                      optionLabel={
                        filterByFieldOptions[key].optionsLabelProperty
                      }
                      label={filterByFieldOptions[key].label}
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
        )}
      </Formik>
      <div className="p-5">
        <ChargebackChart />
      </div>
    </div>
  );
};
