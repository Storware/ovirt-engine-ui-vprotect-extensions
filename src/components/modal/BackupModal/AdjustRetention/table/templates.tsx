import React from 'react';

export const DestinationTemplate = ({ backupDestination, roleType }) => (
  <>
    {backupDestination?.name} ({roleType?.description})
  </>
);
