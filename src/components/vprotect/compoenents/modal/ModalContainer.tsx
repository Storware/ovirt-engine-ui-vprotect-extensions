import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Modal, Icon} from 'patternfly-react'
import {selectModal, selectProps, selectShow} from '../../../../store/modal/selectors';
import {hideModal, saveModal} from '../../../../store/modal/actions';
import {Button} from 'primereact/button';

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
                    <Icon type='pf' name='close'/>
                </button>
                <Modal.Title>Backup</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ModalComponentClass {...props}  />
            </Modal.Body>
            <Modal.Footer>
                <div className='d-flex justify-content-between'>
                    <Button className='p-button-danger'
                            onClick={() => {
                                dispatch(hideModal())
                            }}
                            label='Cancel'
                    />
                    <Button className='p-button-success'
                            onClick={() => {
                                dispatch(saveModal())
                            }}
                            label='Save'
                    />
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalContainer
