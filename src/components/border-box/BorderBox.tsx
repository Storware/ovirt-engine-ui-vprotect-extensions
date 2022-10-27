import React from 'react';

export const BorderBox = ({
  heading,
  children,
}: {
  heading: string;
  children?: React.ReactNode;
}) => (
  <div className={'border-box'}>
    <div className={'progress-bar-title-h4'}>{heading}</div>
    {children}
  </div>
);
