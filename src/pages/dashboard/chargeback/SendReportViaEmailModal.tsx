import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSaved } from 'store/modal/selectors';
import globalSettingsService from 'services/global-settings-service';
import { StringDTO } from 'model/dto/string';
import { Field, Form, Formik } from 'formik';
import Text from 'components/input/reactive/Text';
import { selectRange } from 'store/reporting/selectors';
import { hideModalAction } from 'store/modal/actions';

let submitFormikForm;

export default () => {
  const [model, setModel] = useState(new StringDTO());
  const range = useSelector(selectRange);
  const dispatch = useDispatch();

  const getEmails = async () => {
    const globalSettings = await globalSettingsService.getGlobalSettings();
    setModel({ value: globalSettings.emailAddress });
  };

  const sendEmail = async (email: StringDTO) => {
    dispatch(hideModalAction());
    await globalSettingsService.sendDashboardInfoEmail(email, range);
  };

  useEffect(() => {
    getEmails();
  }, []);

  if (useSelector(selectSaved)) {
    submitFormikForm();
  }

  return (
    <div>
      <Formik enableReinitialize initialValues={model} onSubmit={sendEmail}>
        {({ submitForm }) => {
          submitFormikForm = submitForm;

          return (
            <Form>
              <Field
                name="value"
                component={Text}
                className="w-100"
                label="E-mail recipients (comma-separated)"
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
