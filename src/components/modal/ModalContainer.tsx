import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideFooter, selectModal, selectShow } from 'store/modal/selectors';
import { hideModalAction, saveModalAction } from 'store/modal/actions';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const ModalContainer = () => {
  const dispatch = useDispatch();
  const modal = useSelector(selectModal);
  const show = useSelector(selectShow);
  const hideButtonActions = useSelector(hideFooter);
  const { component: Component, buttonLabel } = modal;

  const renderFooter = () => {
    return (
      <div>
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => dispatch(hideModalAction())}
          className="p-button-text"
        />
        <Button
          label={buttonLabel ? buttonLabel : 'Save'}
          icon="pi pi-check"
          onClick={() => dispatch(saveModalAction())}
        />
      </div>
    );
  };

  return (
    <div className="dialog-demo">
      <div className="card">
        <Dialog
          header={modal.title}
          visible={show}
          style={{ width: '50vw' }}
          footer={!hideButtonActions && renderFooter()}
          onHide={() => dispatch(hideModalAction())}
        >
          <Component {...modal.props} />
        </Dialog>
      </div>
    </div>
  );
};

export default ModalContainer;
