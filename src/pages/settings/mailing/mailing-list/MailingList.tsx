import React, { useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { getMailingList, save } from 'store/mailing/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectMailing } from 'store/mailing/selectors';
import Text from 'components/input/reactive/Text';
import { useParams } from 'react-router-dom';
import { BackButton } from 'utils/backButton';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import InputChips from 'components/input/reactive/InputChips';
import { MailingListModel } from 'model/mailing/mailing';
import { projectsService } from 'services/projects-service';
import Select from 'components/input/reactive/Select';

const MailingList = () => {
  const dispatch = useDispatch();
  const { guid } = useParams();
  const [projects, setProjects] = useState([]);

  const model =
    guid === 'create' ? new MailingListModel() : useSelector(selectMailing);

  const getProjects = async () => {
    const p = await projectsService.getAllProjects();
    setProjects([{ name: '', guid: '' }, ...p]);
  };

  useEffect(() => {
    dispatch(getMailingList(guid));
  }, [guid]);

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="form">
      <Formik
        enableReinitialize
        initialValues={model}
        onSubmit={async (values) => {
          // @ts-ignore
          const { project } = values;
          await save({
            ...values,
            project: project.guid ? project : null,
          });
          history.back();
        }}
      >
        {() => (
          <Form>
            <Panel header="Mailing List">
              <Field name="name" component={Text} label="Name" />
              <Field
                name="recipients"
                component={InputChips}
                label="Add recipient"
              />
              <Field
                name="project"
                component={Select}
                options={projects}
                label="Project"
                optionLabel="name"
              />
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
