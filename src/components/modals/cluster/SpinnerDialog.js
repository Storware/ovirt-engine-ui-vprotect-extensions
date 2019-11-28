import React from 'react'
import PropTypes from 'prop-types'

import {
  EmptyState,
  Modal,
  Spinner
} from 'patternfly-react'

const SpinnerDialog = ({
  container,
  show,
  title,
  message,
  onHide,
  ...props
}) => {
  return <Modal
    container={container}
    show={show}
    onHide={onHide}
    {...props}
  >
    <Modal.Header>
      <Modal.CloseButton onClick={onHide} />
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <EmptyState>
        <Spinner size='lg' className='blank-slate-pf-icon' loading />
        <EmptyState.Action>
          <h3>{title}</h3>
        </EmptyState.Action>
        <EmptyState.Action secondary>
          <p>{message}</p>
        </EmptyState.Action>
      </EmptyState>
    </Modal.Body>
  </Modal>
}

SpinnerDialog.propTypes = {
  container: PropTypes.any,
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired
}

export default SpinnerDialog
