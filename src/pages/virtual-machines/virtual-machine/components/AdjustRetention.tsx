import { Button } from 'primereact/button';
import React from 'react';
import { useDispatch } from 'react-redux';
import { hideFooterAction, showModalAction } from 'store/modal/actions';
import { AdjustRetentionModal } from 'components/modal/BackupModal/AdjustRetention/AdjustRetentionModal';

export const AdjustRetention = ({ data = [], onSave, ...props }) => {
  const dispatch = useDispatch();
  const openModal = () => {
    dispatch(hideFooterAction());

    dispatch(
      showModalAction({
        component: AdjustRetentionModal,
        props: { value: data, onSave },
        style: {
          width: '90vw',
        },
      }),
    );
  };
  return (
    <div className={'my-2'}>
      <Button label="Adjust retention" {...props} onClick={openModal} />
    </div>
  );
};
