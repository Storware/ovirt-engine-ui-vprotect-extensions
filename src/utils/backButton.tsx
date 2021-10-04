import { Button } from 'primereact/button';
import React from 'react';
import { Link } from 'react-router-dom';

export const BackButton = () => (
  <Link to="../">
    <Button type="button" label="Back" />
  </Link>
);
