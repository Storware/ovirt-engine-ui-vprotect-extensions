import React from 'react';
import { Field } from 'formik';
import Select from 'components/input/reactive/Select';
import InputChips from 'components/input/reactive/InputChips';
import InputListBox from 'components/input/reactive/InputListBox';
import { policiesService } from 'services/policies-service';
import { Button } from 'primereact/button';
import { hideFooterAction, showModalAction } from 'store/modal/actions';
import { useDispatch } from 'react-redux';
import { AutoAssigmentPreviewModal } from 'components/modal/AutoAssigmentPreviewModal';

export const AutoAssigment = ({
  model,
  setModel,
  handle,
  hypervisorClusters,
  type,
}) => {
  const dispatch = useDispatch();

  return (
    <>
      {' '}
      <Field
        name="autoAssignSettings.mode"
        options={policiesService.assignModes}
        component={Select}
        optionLabel="description"
        dataKey="name"
        required
        label="Auto-assign Mode *"
        change={({ value }) => {
          setModel({
            ...model,
            autoAssignSettings: {
              ...model.autoAssignSettings,
              mode: value,
            },
          });
        }}
      />
      <h5 className={'mt-3'}>Include rules</h5>
      <div className={'row'}>
        <div className={'col'}>
          <Field
            name="autoAssignSettings.includeTags"
            component={InputChips}
            label="Include TAG based rules"
            onChange={handle('autoAssignSettings.includeTags')}
          />
        </div>
        <div className={'col'}>
          <Field
            name="autoAssignSettings.includeRegExps"
            component={InputChips}
            label="Include Regex based rules"
            onChange={handle('autoAssignSettings.includeRegExps')}
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
            onChange={handle('autoAssignSettings.excludeTags')}
          />
        </div>
        <div className={'col'}>
          <Field
            name="autoAssignSettings.excludeRegExps"
            component={InputChips}
            label="Exclude Regex based rules"
            onChange={handle('autoAssignSettings.excludeRegExps')}
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
        onChange={(e) => {
          setModel({
            ...model,
            autoAssignSettings: {
              ...model.autoAssignSettings,
              hvClusters:
                e.target?.nodeName === 'INPUT' ? e.target.value : e.value,
            },
          });
        }}
        label="Auto-assign Virtual Environments only if they belong to the following clusters (optional)"
      />
      <div className="d-flex flex-row-reverse mt-2">
        <Button
          type="button"
          label="Preview"
          onClick={async () => {
            dispatch(hideFooterAction());
            const previewAutoAssign =
              await policiesService.autoAssignmentPreview(type, model);

            dispatch(
              showModalAction({
                component: AutoAssigmentPreviewModal,
                title: 'Preview',
                props: {
                  value: previewAutoAssign || [],
                },
              }),
            );
          }}
        />
      </div>
    </>
  );
};
