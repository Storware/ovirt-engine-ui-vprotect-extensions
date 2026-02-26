import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'primereact/tooltip';
import { selectModal } from 'store/modal/selectors';
import { saveModalAction } from 'store/modal/actions';
import { setIsSelectedRulesZero } from 'store/backup-modal/actions';
import { useTypedSelector } from '@/store/useTypedSelector';

export const NoActiveRulesIcon = ({ entities }: any) => {
  const dispatch = useDispatch();
  const modal = useTypedSelector(selectModal);
  const { component: Component, buttonLabel } = modal;
  const { payload } = useTypedSelector(setIsSelectedRulesZero);
  const isRuleWarning = payload.backupModal.isSelectedRulesZero;

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
