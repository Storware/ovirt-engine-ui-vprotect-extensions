import React, { useEffect } from 'react';
import CredentialForm, {
  initialValues,
} from '../../components/credentials/CredentialForm';
import { Panel } from 'primereact/panel';
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedCredential } from '../../store/credentials/selectors';
import { CredentialModel } from '../../model';
import { useParams } from 'react-router-dom';
import { getCredential, saveCredential } from '../../store/credentials/actions';
import { Button } from 'primereact/button';

interface Props {
  type: 'Edit' | 'Create';
}

const Credential = ({ type }: Props) => {
  const { guid } = useParams();
  const dispatch = useDispatch();

  const model = !!guid
    ? useSelector(selectSelectedCredential)
    : new CredentialModel();

  const iv = {
    ...initialValues,
    ...model,
  };

  useEffect(() => {
    dispatch(getCredential(guid));
  }, [guid]);

  return (
    <Formik
      initialValues={iv}
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
      enableReinitialize
      isInitialValid={false}
    >
      {(props) => (
        <Form className="form">
          <Panel header={`${type} Credential`}>
            <CredentialForm {...props} />
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
              disabled={props.values.password !== props.values.retypePassword}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default Credential;
