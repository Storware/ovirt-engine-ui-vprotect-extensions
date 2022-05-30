import React from 'react';

export const BorderBox = ({
  heading,
  children,
}: {
  heading: string;
  children?: React.ReactNode;
}) => (
  <div className={'border-box'}>
    <h4>{heading}</h4>
    {children}
  </div>
);
