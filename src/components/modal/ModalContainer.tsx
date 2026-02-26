import { useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { hideFooter, selectModal, selectShow } from 'store/modal/selectors';
import { hideModalAction, saveModalAction } from 'store/modal/actions';
import { useTypedSelector } from '@/store/useTypedSelector';

// Deprecated
const ModalContainer = () => {
  const dispatch = useDispatch();
  const modal = useTypedSelector(selectModal);
  const show = useTypedSelector(selectShow);
  const hideButtonActions = useTypedSelector(hideFooter);
  const { component: Component, buttonLabel, width } = modal;
  const {
    FooterContent: FooterContent = () => (
      <Button
        label={buttonLabel ? buttonLabel : 'Save'}
        icon="pi pi-check"
        onClick={() => dispatch(saveModalAction())}
      />
    ),
    footerClassName = '',
  } = modal;

  const renderFooter = () => (
    <div className={footerClassName}>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => dispatch(hideModalAction())}
        className="p-button-text"
      />
      <FooterContent />
    </div>
  );

  return (
    <div className="dialog-demo">
      <div className="card">
        <Dialog
          header={modal.title}
          visible={show}
          style={{ width: width ? width : '50vw', ...modal.style }}
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
