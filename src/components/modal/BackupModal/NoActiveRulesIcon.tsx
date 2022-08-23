import React from 'react';
import { Button } from 'components/button';

export const NoActiveRulesIcon = ({ entities }) => {
  const isRuleWarning = entities.every(
    ({ policy }) => policy?.rules.length === 0,
  );

  return isRuleWarning ? (
    <Button
      icon="pi pi-exclamation-triangle"
      className="p-button-warning p-button-text"
      tooltip={'No active rules present for the backup'}
      tooltipOptions={{ position: 'top' }}
    />
  ) : (
    <></>
  );
};
