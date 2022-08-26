import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import Calendar from 'components/input/reactive/Calendar';
import { useDispatch, useSelector } from 'react-redux';
import { selectRange } from 'store/reporting/selectors';
import { setRange } from 'store/reporting/actions';
import { Range } from 'model/report/range';

export default () => {
  const dispatch = useDispatch();
  const model = useSelector(selectRange);
  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={model}
        onSubmit={(values: Range) => {
          dispatch(setRange(values));
        }}
      >
        <Form className="mb-4">
          <div className="d-flex align-items-center">
            <Field
              name="from"
              component={Calendar}
              label="From"
              className="d-inline-block"
            />
            <Field
              name="to"
              component={Calendar}
              label="To"
              className="d-inline-block ml-4"
            />

            <Button
              type="submit"
              label="Apply"
              className="p-button-success ml-4 d-flex align-self-end"
            />
          </div>
        </Form>
      </Formik>
    </div>
  );
};
