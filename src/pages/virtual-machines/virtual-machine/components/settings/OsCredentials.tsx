import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideFooterAction } from 'store/modal/actions';
import { getCredentials } from 'store/credentials/actions';
import Select from 'components/input/Select';
import { selectCredentials } from 'store/credentials/selectors';

export const OsCredentials = ({ model, setModel }) => {
  const dispatch = useDispatch();
  const data = useSelector(selectCredentials);

  dispatch(hideFooterAction());

  useEffect(() => {
    dispatch(getCredentials);
  }, []);
  return (
    <div>
      <Select
        value={model.credential}
        options={[{ name: '' }, ...data]}
        label="Credentials"
        optionLabel="name"
        dataKey="guid"
        onChange={({ value }) => {
          setModel({ ...model, credential: value });
        }}
        placeholder=""
      />
    </div>
  );
};
