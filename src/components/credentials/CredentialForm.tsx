import React from 'react';
import { CredentialModel } from '../../model';
import { Field } from 'formik';
import Text from '../input/reactive/Text';
import { InputSwitch } from 'primereact/inputswitch';
import { toBase64 } from '../../utils/toBase64';

export const initialValues = {
  ...new CredentialModel(),
  showSecretKey: false,
  showAdditionalSettings: false,
  retypePassword: '',
  filename: '',
};

const CredentialForm = ({ values, setFieldValue, hideSecretKey = false }) => (
  <>
    <Field name="name" label="Name *" component={Text} required />

    {!hideSecretKey && (
      <>
        <Field
          name="secretKey"
          label="Secret key"
          type={values.showSecretKey ? 'text' : 'password'}
          component={Text}
        />
        <div className="pt-3">
          <InputSwitch
            checked={values.showSecretKey}
            onChange={({ value }) => setFieldValue('showSecretKey', value)}
          />
          <label className="pl-2 p-checkbox-label">Show Secret key</label>
        </div>
      </>
    )}

    <h6 className="mt-4">REMOTE ACCESS</h6>
    <Field name="user" label="SSH user *" component={Text} required />

    <Field
      name="password"
      label="SSH password *"
      component={Text}
      type="password"
      required
    />
    <Field
      name="retypePassword"
      label="Retype password *"
      component={Text}
      type="password"
      required
    />

    <div className="pt-3">
      <InputSwitch
        checked={values.showAdditionalSettings}
        onChange={({ value }) => setFieldValue('showAdditionalSettings', value)}
      />
      <label className="pl-2 p-checkbox-label">
        Show additional options for remote SSH
      </label>
    </div>

    <div hidden={!values.showAdditionalSettings}>
      <Field name="sshKeyPath" label="SSH key path" component={Text} />
      <label className="p-button p-component mt-3">
        <input
          name="sshKey"
          type="file"
          onChange={async ({ currentTarget: { files } }) => {
            setFieldValue('sshKey', await toBase64(files[0]));
            setFieldValue('filename', files[0].name);
          }}
          style={{ display: 'none' }}
        />
        <span>SSH key</span>
      </label>
      <p>{values.filename}</p>
    </div>
  </>
);
export default CredentialForm;
