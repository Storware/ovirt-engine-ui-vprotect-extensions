import { useEffect } from 'react';
import { Field, Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { getMailingList, save } from 'store/mailing/actions';
import { selectMailing } from 'store/mailing/selectors';
import Text from 'components/input/reactive/Text';
import { BackButton } from '@/components/BackButton';
import { MailingListModel } from 'model/mailing/mailing';
import { InputList } from 'components/input/reactive/InputList';
import { useTypedSelector } from '@/store/useTypedSelector';

const MailingList = () => {
  const dispatch = useDispatch();
  const { guid } = useParams();

  const model = useTypedSelector((store) =>
    guid === 'create' ? new MailingListModel() : selectMailing(store),
  );

  const focusLastRecipientInput = () => {
    setTimeout(() => {
      const inputs = document.querySelectorAll('form .recipient-input');
      (inputs[inputs.length - 1] as any).focus();
    });
  };

  useEffect(() => {
    dispatch(getMailingList(guid));
  }, [guid]);

  return (
    <div className="form">
      <Formik
        enableReinitialize
        initialValues={model}
        onSubmit={async (values) => {
          await save(values);
          history.back();
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Panel header="Mailing List">
              <Field
                name="name"
                component={Text}
                label="Name *"
                required={true}
              />
              <div className="d-flex flex-column align-items-start">
                <Field
                  name="recipients"
                  component={InputList}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      // @ts-ignore
                      setFieldValue('recipients', [...values.recipients, '']);
                      focusLastRecipientInput();
                    }
                  }}
                  label="Add recipient"
                  required={true}
                  className="recipient-input"
                />
                <Button
                  label="Add recipient"
                  type="button"
                  onClick={(v) => {
                    v.preventDefault();
                    // @ts-ignore
                    setFieldValue('recipients', [...values.recipients, '']);
                  }}
                />
              </div>
            </Panel>
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

export default MailingList;
