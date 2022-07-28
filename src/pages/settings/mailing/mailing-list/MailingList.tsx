import React, { DOMElement, useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { getMailingList, save } from 'store/mailing/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectMailing } from 'store/mailing/selectors';
import Text from 'components/input/reactive/Text';
import { useParams } from 'react-router-dom';
import { BackButton } from 'utils/backButton';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { MailingListModel } from 'model/mailing/mailing';
import { InputList } from 'components/input/reactive/InputList';

const MailingList = () => {
  const dispatch = useDispatch();
  const { guid } = useParams();

  const model =
    guid === 'create' ? new MailingListModel() : useSelector(selectMailing);

  const focusLastRecipientInput = () => {
    setTimeout(() => {
      const inputs = document.querySelectorAll('form .recipient-input');
      // @ts-ignore
      inputs[inputs.length - 1].focus();
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
