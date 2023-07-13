import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Field, Form, Formik, useFormikContext } from 'formik';
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
import isNotOpenstackBuild from 'utils/isNotOpenstackBuild';
import { selectRange } from 'store/reporting/selectors';
import {
  setBackupFilter,
  setTransferFilter,
} from 'store/export-report/actions';
import {
  selectBackupSizeFilters,
  selectTransferSizeFilters,
} from 'store/export-report/selectors';
import { FilterState } from 'model/export-report/filterState';
import { TableParams } from 'model/pagination/TableParams';
import { Paginator } from 'primereact/paginator';

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
    value: 'virtual-machine',
    label: 'Virtual Machine',
  },
  ...(isNotOpenstackBuild
    ? [
        {
          value: 'hypervisor',
          label: 'Hypervisor',
        },
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
  virtualMachineGuids: {
    label: 'Virtual Environment',
    optionsLabelProperty: 'name',
  },
  ...(isNotOpenstackBuild && {
    hypervisorGuids: {
      label: 'Hypervisor',
      optionsLabelProperty: 'host',
      options: [],
    },
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

export const mapPropertiesObjectListToStringOfGuids = (
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

const FormikChangeHandler = ({ isItBackupSizeTab }) => {
  const formik = useFormikContext();
  const dispatch = useDispatch();

  useEffect(() => {
    const newState: FilterState = formik.values as FilterState;
    dispatch(
      isItBackupSizeTab
        ? setBackupFilter(newState)
        : setTransferFilter(newState),
    );
  }, [formik.values]);
  return <></>;
};

export const ReportSizeContainer = ({ chartData, getChargebackData }) => {
  const propertyOptions = useSelector(selectPropertyOptions);
  const dispatch = useDispatch();
  const chargeBackRequest = new ChargebackRequest();
  const range = useSelector(selectRange);
  const { url } = useRouteMatch();
  const isItBackupSizeTab: boolean = url.includes('backup-size');
  const previousFilterStates = isItBackupSizeTab
    ? useSelector(selectBackupSizeFilters)
    : useSelector(selectTransferSizeFilters);

  useEffect(() => {
    dispatch(
      getChargebackData(
        range,
        mapPropertiesObjectListToStringOfGuids(chargeBackRequest),
      ),
    );
  }, [range]);

  const handleOnSubmit = (value) => {
    dispatch(
      getChargebackData(range, mapPropertiesObjectListToStringOfGuids(value)),
    );
  };

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={previousFilterStates}
        onSubmit={handleOnSubmit}
      >
        {(props) => (
          <Form className="mb-4">
            <FormikChangeHandler isItBackupSizeTab={isItBackupSizeTab} />
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
              const [show, setShow] = useState(
                previousFilterStates[key].length > 0,
              );
              const [showSelected, setShowSelected] = useState(false);
              const [listParams, setListParams] = useState<TableParams>(
                new TableParams(),
              );

              useEffect(() => {
                dispatch(getPropertyOptions(key, propertyOptions, listParams));
              }, [listParams, showSelected]);

              const handlePaginateChange = (e) => {
                setListParams({ size: e.rows, page: e.page });
              };

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
                          ? getPropertyOptions(key, propertyOptions, listParams)
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
                    <>
                      <Button
                        className={
                          'ml-2 ' + (showSelected ? '' : 'p-button-outlined')
                        }
                        label={'Selected: ' + props.values[key].length}
                        onClick={() => setShowSelected(!showSelected)}
                      />
                      <Field
                        name={key}
                        component={InputListBox}
                        options={
                          showSelected
                            ? props.values[key]
                            : propertyOptions[key]
                        }
                        optionLabel={
                          filterByFieldOptions[key].optionsLabelProperty
                        }
                        label={filterByFieldOptions[key].label}
                        multiple
                      />
                      {propertyOptions[key + 'Total'] > 10 && (
                        <Paginator
                          first={listParams.size * listParams.page}
                          rowsPerPageOptions={[5, 10, 20]}
                          rows={listParams.size}
                          totalRecords={propertyOptions[key + 'Total']}
                          onPageChange={(e) => handlePaginateChange(e)}
                        ></Paginator>
                      )}
                    </>
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
        <ChargebackChart chartData={chartData} />
      </div>
    </div>
  );
};
