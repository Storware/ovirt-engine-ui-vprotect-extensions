import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { policiesService } from 'services/policies-service';
import { Button } from 'primereact/button';
import { Field, Form, Formik } from 'formik';
import Text from 'components/input/reactive/Text';
import { PolicySnapshot } from 'model/policies/policy-snapshot';
import Toggle from 'components/input/reactive/Toggle';
import Select from 'components/input/reactive/Select';
import InputSlider from 'components/input/reactive/InputSlider';
import InputChips from 'components/input/reactive/InputChips';
import {
  selectBackupDestinations,
  selectHypervisorClusters,
  selectPolicy,
  selectSchedules,
  selectVirtualMachines,
} from 'store/policy/selectors';
import { getPolicyPage } from 'store/policy/actions';
import { useParams } from 'react-router-dom';
import InputListBox from 'components/input/reactive/InputListBox';
import { save } from 'store/policy/actions';
import { createBrowserHistory } from 'history';
import { BackButton } from 'utils/backButton';

const SnapshotPolicy = () => {
  const dispatch = useDispatch();
  const { guid } = useParams();
  const history = createBrowserHistory();

  const model =
    guid === 'create' ? new PolicySnapshot() : useSelector(selectPolicy);
  const hypervisorClusters = useSelector(selectHypervisorClusters);
  const virtualMachines = useSelector(selectVirtualMachines);
  const backupDestinations = useSelector(selectBackupDestinations);
  const schedules = useSelector(selectSchedules);

  useEffect(() => {
    dispatch(getPolicyPage('vm-snapshot', guid));
  }, [guid]);

  const [activeIndex, setActiveIndex] = useState({
    first: [0],
    second: [],
  });

  return (
    <div className="form">
      <Formik
        enableReinitialize
        initialValues={model}
        onSubmit={async (values) => {
          await save(values, 'vm-snapshot');
          history.back();
        }}
      >
        {() => (
          <Form>
            <Accordion
              multiple
              activeIndex={activeIndex.first}
              onTabChange={(e) =>
                setActiveIndex({
                  ...activeIndex,
                  // @ts-ignore
                  first: e.index,
                })
              }
            >
              <AccordionTab header="GeneralTable">
                <Field name="name" component={Text} label="Name" />
                <Field
                  name="active"
                  component={Toggle}
                  label="Scheduled backups enabled"
                />
                <Field
                  name="autoRemoveNonPresent"
                  component={Toggle}
                  label="Auto remove non-present Virtual Environments"
                />
                <Field
                  name="backupRetryCount"
                  component={Text}
                  label="Retry Count"
                  required
                />
                <Field
                  name="priority"
                  component={InputSlider}
                  label="Priority"
                />
              </AccordionTab>
              <AccordionTab header="Auto-assigment">
                <Field
                  name="autoAssignSettings.mode"
                  options={policiesService.assignModes}
                  component={Select}
                  optionLabel="description"
                  dataKey="name"
                  required
                  label="Auto-assign Mode"
                />

                <h5 className={'mt-3'}>Include rules</h5>
                <div className={'row'}>
                  <div className={'col'}>
                    <Field
                      name="autoAssignSettings.includeTags"
                      component={InputChips}
                      label="Include TAG based rules"
                    />
                  </div>
                  <div className={'col'}>
                    <Field
                      name="autoAssignSettings.includeRegExps"
                      component={InputChips}
                      label="Include Regex based rules"
                    />
                  </div>
                </div>

                <h5 className={'mt-3'}>Exclude rules</h5>
                <div className={'row'}>
                  <div className={'col'}>
                    <Field
                      name="autoAssignSettings.excludeTags"
                      component={InputChips}
                      label="Exclude TAG based rules"
                    />
                  </div>
                  <div className={'col'}>
                    <Field
                      name="autoAssignSettings.excludeRegExps"
                      component={InputChips}
                      label="Exclude Regex based rules"
                    />
                  </div>
                </div>

                <Field
                  name="autoAssignSettings.hvClusters"
                  options={hypervisorClusters}
                  component={InputListBox}
                  optionLabel="name"
                  multiple
                  dataKey="guid"
                  label="Auto-assign Virtual Environments only if they belong to the following clusters (optional)"
                />
              </AccordionTab>

              <AccordionTab header="Virtual Environments">
                <Field
                  name="vms"
                  options={virtualMachines}
                  component={InputListBox}
                  optionLabel="name"
                  multiple
                  dataKey="guid"
                  label="Choose Virtual Environments"
                />
              </AccordionTab>

              <AccordionTab header="Rule">
                <Field
                  name="rules[0].retentionVersions"
                  component={Text}
                  label="Retention versions"
                />
                <Field
                  name="rules[0].retentionDays"
                  component={Text}
                  label="Retention days"
                />

                <Field
                  name="rules[0].schedules"
                  options={schedules}
                  component={InputListBox}
                  optionLabel="name"
                  multiple
                  dataKey="guid"
                  label="Choose schedules"
                />
              </AccordionTab>
            </Accordion>

            <div className="d-flex justify-content-between mt-3">
              <div>
                <BackButton />
              </div>
              <div>
                <Button
                  type="submit"
                  label="Save"
                  className="p-button-success"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SnapshotPolicy;
