import React from 'react';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { selectModal } from '../../../store/modal/selectors';
import { saveModalAction } from '../../../store/modal/actions';
import { Tooltip } from 'primereact/tooltip';

export const NoActiveRulesIcon = ({ entities }) => {
  const dispatch = useDispatch();
  const modal = useSelector(selectModal);
  const { component: Component, buttonLabel } = modal;
  const isRuleWarning = entities.every(({ policy }) => policy);

  return isRuleWarning ? (
    <>
      <span id="disabledSaveModalButton">
        <Button
          label={buttonLabel ? buttonLabel : 'Save'}
          icon="pi pi-exclamation-triangle"
          onClick={() => dispatch(saveModalAction())}
          disabled
        />
      </span>
      <Tooltip position="top" target="#disabledSaveModalButton">
        No active rules present for the backup
      </Tooltip>
    </>
  ) : (
    <Button
      label={buttonLabel ? buttonLabel : 'Save'}
      icon="pi pi-check"
      onClick={() => dispatch(saveModalAction())}
    />
  );
};
