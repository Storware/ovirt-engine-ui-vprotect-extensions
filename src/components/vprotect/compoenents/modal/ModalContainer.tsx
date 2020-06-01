import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Modal, Icon} from 'patternfly-react'
import {selectModal, selectProps, selectShow} from '../../../../store/modal/selectors';
import {hideModal, saveModal} from '../../../../store/modal/actions';

const ModalContainer = () => {
    let dispatch = useDispatch();
    let ModalComponentClass = useSelector(selectModal);
    let props = useSelector(selectProps);



    return (
        <Modal show>
            <Modal.Header>
                <button
                    className='close'
                    aria-hidden='true'
                    aria-label='Close'
                    onClick={() => {
                        dispatch(hideModal())
                    }}
                >
                    <Icon type='pf' name='close' />
                </button>
                <Modal.Title>Backup</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ModalComponentClass {...props}  />
            </Modal.Body>
            <Modal.Footer>
                <button onClick={() => {
                    dispatch(hideModal())
                }}>
                    Cancel
                </button>
                <button onClick={() => {
                    dispatch(saveModal())
                }}>
                    Save
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalContainer
