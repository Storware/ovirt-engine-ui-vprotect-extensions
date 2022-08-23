import { Button as PrimeButton, ButtonProps } from 'primereact/button';
import React from 'react';

export const Button = (props: ButtonProps) => (
  <PrimeButton onFocus={(e: any) => e.target.blur()} {...props} />
);
