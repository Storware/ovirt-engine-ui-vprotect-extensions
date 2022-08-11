import React from 'react';
import { Button, ButtonProps } from 'primereact/button';

interface Props {
  save: ButtonProps;
  cancel: ButtonProps;
}

export type FooterProps = Partial<Props>;

export const Footer: React.FC<FooterProps> = ({ save, cancel }) => (
  <div>
    <Button
      label="Cancel"
      icon="pi pi-times"
      className="p-button-text"
      {...cancel}
    />
    {/* { children } */}
    <Button
      label="Save"
      icon="pi pi-check"
      className="p-button-success"
      {...save}
    />
  </div>
);
