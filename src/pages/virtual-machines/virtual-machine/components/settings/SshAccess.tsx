import React from 'react';
import { InputText } from 'primereact/inputtext';

export const SshAccess = ({ model, setModel }) => {
  const { sshHost = '', sshPort = '' } = model;

  return (
    <>
      <div>
        <h6>SSH host</h6>
        <InputText
          value={sshHost}
          type="text"
          onChange={({ target: { value } }) => {
            setModel({
              ...model,
              sshHost: value,
            });
          }}
        />
      </div>
      <div className={'mt-2'}>
        <h6>SSH port</h6>
        <InputText
          value={sshPort}
          type="text"
          onChange={({ target: { value } }) => {
            setModel({
              ...model,
              sshPort: value,
            });
          }}
        />
      </div>
    </>
  );
};
