import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CredentialModel } from '../../../model';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import Text from '../../../components/input/reactive/Text';
import { InputSwitch } from 'primereact/inputswitch';
import { Panel } from 'primereact/panel';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedCredential } from '../../../store/credentials/selectors';
import {
  getCredential,
  saveCredential,
} from '../../../store/credentials/actions';
import { createBrowserHistory } from 'history';
import { toBase64 } from '../../../utils/toBase64';

interface Props {
  header?: string;
}
const history = createBrowserHistory();

const CredentialForm = ({ header = '' }: Props) => {
  const { guid } = useParams();

  const dispatch = useDispatch();
  const model = !!guid
    ? useSelector(selectSelectedCredential)
    : new CredentialModel();

  const initialValues = {
    ...model,
    showSecretKey: false,
    showAdditionalSettings: false,
    retypePassword: '',
    filename: '',
  };

  useEffect(() => {
    dispatch(getCredential(guid));
  }, [guid]);

  return (
    <div className="form">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async ({
          showSecretKey,
          showAdditionalSettings,
          retypePassword,
          filename,
          ...credential
        }) => {
          await saveCredential(credential);
          history.back();
        }}
      >
        {({
          values: {
            showSecretKey,
            showAdditionalSettings,
            filename,
            password,
            retypePassword,
          },
          setFieldValue,
        }) => (
          <Form>
            <Panel header={header}>
              <Field name="name" label="Name *" component={Text} required />
              <Field
                name="secretKey"
                label="Secret key"
                type={showSecretKey ? 'text' : 'password'}
                component={Text}
              />
              <div className="pt-3">
                <InputSwitch
                  checked={showSecretKey}
                  onChange={({ value }) =>
                    setFieldValue('showSecretKey', value)
                  }
                />
                <label className="pl-2 p-checkbox-label">Show Secret key</label>
              </div>

              <h6>REMOTE ACCESS</h6>
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
                  checked={showAdditionalSettings}
                  onChange={({ value }) =>
                    setFieldValue('showAdditionalSettings', value)
                  }
                />
                <label className="pl-2 p-checkbox-label">Show Secret key</label>
              </div>

              <div
                style={{
                  visibility: showAdditionalSettings ? 'unset' : 'hidden',
                  height: showAdditionalSettings ? 'unset' : '0',
                }}
              >
                <Field
                  name="sshKeyPath"
                  label="SSH key path"
                  component={Text}
                />
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
                <p>{filename}</p>
              </div>
            </Panel>

            <div className="d-flex justify-content-between mt-3">
              <Button
                type="button"
                label="Cancel"
                onClick={() => {
                  history.back();
                }}
              />
              <Button
                type="submit"
                label="Apply"
                className="p-button-success ml-4"
                disabled={password !== retypePassword}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default CredentialForm;
