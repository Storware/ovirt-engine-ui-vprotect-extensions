import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  hideFooterAction,
  hideModalAction,
  showModalAction,
} from '../../../../../store/modal/actions';
import CredentialForm, {
  initialValues,
} from '../../../../../components/credentials/CredentialForm';
import { Form, Formik } from 'formik';
import {
  getCredentials,
  saveCredential,
} from '../../../../../store/credentials/actions';
import Select from '../../../../../components/input/Select';
import { selectCredentials } from '../../../../../store/credentials/selectors';
import { CredentialModel } from '../../../../../model';

export const OsCredentials = ({
  onChange,
}: {
  onChange?: (credential: CredentialModel) => void;
}) => {
  const [credential, setCredential] = useState();
  const dispatch = useDispatch();
  const data = useSelector(selectCredentials);

  dispatch(hideFooterAction());

  useEffect(() => {
    dispatch(getCredentials);
  }, []);
  return (
    <div>
      <div className="text-right">
        <Button
          label="Create Credential"
          onClick={() => {
            dispatch(
              showModalAction({
                component: Credential,
                title: 'Create Credential',
              }),
            );
          }}
        />
      </div>
      <Select
        value={credential}
        options={[{ name: '' }, ...data]}
        label="Credentials"
        optionLabel="name"
        dataKey="guid"
        onChange={({ value }) => {
          setCredential(value);
          onChange(value);
        }}
        placeholder=""
      />
    </div>
  );
};

const Credential = () => {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async ({
        showSecretKey,
        showAdditionalSettings,
        retypePassword,
        filename,
        ...credential
      }) => {
        await saveCredential(credential);
        dispatch(hideModalAction());
        dispatch(getCredentials);
      }}
      enableReinitialize
      isInitialValid={false}
    >
      {(props) => (
        <Form>
          <CredentialForm {...props} />
          <div className="d-flex justify-content-between mt-3">
            <Button
              type="button"
              label="Cancel"
              onClick={() => {
                dispatch(hideModalAction());
              }}
            />
            <Button
              type="submit"
              label="Save"
              className="p-button-success ml-4"
              disabled={props.values.password !== props.values.retypePassword}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default Credential;
