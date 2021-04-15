import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Icon } from 'patternfly-react';
import { selectModal } from 'store/modal/selectors';
import { hideModalAction, saveModalAction } from 'store/modal/actions';
import { Button } from 'primereact/button';

const ModalContainer = () => {
  const dispatch = useDispatch();
  const modal = useSelector(selectModal);

  const Component = modal.component;

  return (
    <Modal show>
      <Modal.Header>
        <button
          className="close"
          aria-hidden="true"
          aria-label="Close"
          onClick={() => {
            dispatch(hideModalAction());
          }}
        >
          <Icon type="pf" name="close" />
        </button>
        <Modal.Title>{modal.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Component {...modal.props} />
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between">
          <Button
            className="p-button-danger"
            onClick={() => {
              dispatch(hideModalAction());
            }}
            label="Cancel"
          />
          <Button
            className="p-button-success"
            onClick={() => {
              dispatch(saveModalAction());
            }}
            label="Save"
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalContainer;
