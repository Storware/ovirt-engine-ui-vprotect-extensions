import React, { useState } from 'react';
import { useRestoreModal } from './hooks/useRestoreModal';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { InputText } from 'primereact/inputtext';
import { RestoreModalForm } from './types';
import { Checkbox } from 'primereact/checkbox';

export const NetworkingTab = () => {
  const form = useFormikContext<RestoreModalForm>();
  const [expandedSecurityGroups, setExpandedSecurityGroups] = useState(false);
  const { loadingNetworkSettings, networkSettings } = useRestoreModal();

  return (
    <div>
      {networkSettings?.targetNetworks &&
        networkSettings?.sourceNetworkWithSecurityGroups.map(
          (sourceNetwork, i) => (
            <div key={i}>
              <div>
                <label> Network for interface {sourceNetwork.name}</label>
                <Field
                  name={`restoredNetworks.${i}.networkGuid`}
                  component={(props: FieldProps) => (
                    <Dropdown
                      name={props.field.name}
                      value={props.field.value}
                      onChange={(e) => {
                        props.field.onChange(e);
                      }}
                      optionValue="guid"
                      optionLabel="name"
                      options={networkSettings.targetNetworks}
                      disabled={loadingNetworkSettings}
                    />
                  )}
                />
              </div>

              <div className="pt-3">
                <label>Specify MAC Address</label>
                <Field
                  name={`restoredNetworks.${i}.macAddressSpecified`}
                  component={(props: FieldProps) => (
                    <ToggleButton
                      name={props.field.name}
                      checked={props.field.value}
                      onChange={(e) => {
                        void props.field.onChange(e);
                      }}
                    />
                  )}
                />
              </div>

              <div className="pt-3">
                <Field
                  name={`restoredNetworks.${i}.macAddress`}
                  component={(props: FieldProps<string, RestoreModalForm>) => (
                    <div>
                      {props.form.values.restoredNetworks[i]
                        .macAddressSpecified && (
                        <>
                          <label>MAC Address</label>
                          <InputText {...props.field} {...(props as any)} />
                        </>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="pt-3">
                <ToggleButton
                  offLabel={`Security Groups (${form.values.restoredNetworks[i].securityGroupGuids.length})`}
                  onLabel={`Security Groups (${form.values.restoredNetworks[i].securityGroupGuids.length})`}
                  checked={expandedSecurityGroups}
                  onChange={(e) => {
                    setExpandedSecurityGroups(e.value);
                  }}
                />
              </div>

              {expandedSecurityGroups && (
                <>
                  <div className="pt-3">
                    <p className="pb-3">Security groups in the backup</p>

                    {sourceNetwork.securityGroupsFromBackup.map(
                      (securityGroup, index) => (
                        <Field
                          key={index}
                          name={`restoredNetworks.${i}.securityGroupGuids`}
                          component={(
                            props: FieldProps<string[], RestoreModalForm>,
                          ) => (
                            <div>
                              <label>
                                <Checkbox
                                  checked={props.field.value.includes(
                                    securityGroup.guid,
                                  )}
                                  onChange={(e) => {
                                    const isChecked = e.checked;
                                    const updatedNetworkSecurityGroups =
                                      isChecked
                                        ? [
                                            ...props.field.value,
                                            securityGroup.guid,
                                          ]
                                        : props.field.value.filter(
                                            (guid) =>
                                              guid !== securityGroup.guid,
                                          );

                                    void props.form.setFieldValue(
                                      `restoredNetworks.${i}.securityGroupGuids`,
                                      updatedNetworkSecurityGroups,
                                    );
                                  }}
                                  className="mr-2"
                                />
                                {securityGroup.name} ({securityGroup.uuid})
                              </label>
                            </div>
                          )}
                        />
                      ),
                    )}
                  </div>

                  <div className="pt-3">
                    <p className="pb-3"> Security groups in the environment </p>

                    {networkSettings.securityGroupsFromHypervisorManager.map(
                      (securityGroupFromHvm, index) => (
                        <Field
                          key={index}
                          name={`restoredNetworks.${i}.securityGroupGuids`}
                          component={(
                            props: FieldProps<string[], RestoreModalForm>,
                          ) => (
                            <div>
                              <label>
                                <Checkbox
                                  checked={props.field.value.includes(
                                    securityGroupFromHvm.guid,
                                  )}
                                  onChange={(e) => {
                                    const isChecked = e.checked;
                                    const updatedNetworkSecurityGroups =
                                      isChecked
                                        ? [
                                            ...props.field.value,
                                            securityGroupFromHvm.guid,
                                          ]
                                        : props.field.value.filter(
                                            (guid) =>
                                              guid !==
                                              securityGroupFromHvm.guid,
                                          );

                                    void props.form.setFieldValue(
                                      `restoredNetworks.${i}.securityGroupGuids`,
                                      updatedNetworkSecurityGroups,
                                    );
                                  }}
                                  className="mr-2"
                                />
                                {securityGroupFromHvm.name} (
                                {securityGroupFromHvm.uuid})
                              </label>
                            </div>
                          )}
                        />
                      ),
                    )}
                  </div>
                </>
              )}
            </div>
          ),
        )}
    </div>
  );
};
