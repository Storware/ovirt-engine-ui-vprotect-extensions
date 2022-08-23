import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideFooter, selectModal, selectShow } from 'store/modal/selectors';
import { hideModalAction, saveModalAction } from 'store/modal/actions';
import { Button } from 'components/button';
import { Dialog } from 'primereact/dialog';

// Deprecated
const ModalContainer = () => {
  const dispatch = useDispatch();
  const modal = useSelector(selectModal);
  const show = useSelector(selectShow);
  const hideButtonActions = useSelector(hideFooter);
  const { component: Component, buttonLabel } = modal;
  const { footerChildren: FooterChildren = () => <></>, footerClassName = '' } =
    modal;

  const renderFooter = () => (
    <div className={footerClassName}>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => dispatch(hideModalAction())}
        className="p-button-text"
      />
      <FooterChildren />
      <Button
        label={buttonLabel ? buttonLabel : 'Save'}
        icon="pi pi-check"
        onClick={() => dispatch(saveModalAction())}
      />
    </div>
  );

  return (
    <div className="dialog-demo">
      <div className="card">
        <Dialog
          header={modal.title}
          visible={show}
          style={{ width: '50vw', ...modal.style }}
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
