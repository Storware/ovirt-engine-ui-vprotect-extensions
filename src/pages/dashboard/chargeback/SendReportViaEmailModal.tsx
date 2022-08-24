import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSaved } from 'store/modal/selectors';
import globalSettingsService from 'services/global-settings-service';
import { StringDTO } from 'model/dto/string';
import { Field, Form, Formik } from 'formik';
import Text from 'components/input/reactive/Text';
import { selectRange } from 'store/reporting/selectors';
import { hideModalAction } from 'store/modal/actions';
import { selectExportRequest } from 'store/export-report/selectors';
import { mapPropertiesObjectListToStringOfGuids } from '../../reporting/components/ReportSizeContainer';

let submitFormikForm;

export const SendReportViaEmailModal = () => {
  const [model, setModel] = useState(new StringDTO());
  const range = useSelector(selectRange);
  const exportRequest = useSelector(selectExportRequest);
  const dispatch = useDispatch();

  const getEmails = async () => {
    const globalSettings = await globalSettingsService.getGlobalSettings();
    setModel({ value: globalSettings.emailAddress });
  };

  const sendEmail = async (email: StringDTO) => {
    dispatch(hideModalAction());
    const exportRequestGuids = {
      backupSize: mapPropertiesObjectListToStringOfGuids(
        exportRequest.backupSize,
      ),
      transferSize: mapPropertiesObjectListToStringOfGuids(
        exportRequest.transferSize,
      ),
      value: email.value,
    };
    if (exportRequestGuids.value.length > 0) {
      await globalSettingsService.sendDashboardInfoEmail(
        range,
        exportRequestGuids,
      );
    }
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

export default SendReportViaEmailModal;
