import React from 'react';

export const DestinationTemplate = ({ backupDestination, roleType }) => {
  return (
    <>
      {backupDestination?.name} ({roleType?.description})
    </>
  );
};
