import { useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { selectSelectedCredential } from '../../store/credentials/selectors';
import { getCredential, saveCredential } from '../../store/credentials/actions';
import CredentialForm, {
  initialValues,
} from '../../components/credentials/CredentialForm';
import { CredentialModel } from '@/model/CredentialModel';
import { useTypedSelector } from '@/store/useTypedSelector';

interface Props {
  type: 'Edit' | 'Create';
}

const Credential = ({ type }: Props) => {
  const { guid } = useParams();
  const dispatch = useDispatch();
  const model = useTypedSelector((s) =>
    guid ? selectSelectedCredential(s) : new CredentialModel(),
  );

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
