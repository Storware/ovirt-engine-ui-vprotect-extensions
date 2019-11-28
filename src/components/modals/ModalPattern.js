import React from 'react'
import PropTypes from 'prop-types'
import { noop, Modal } from 'patternfly-react'

// TODO(vs) remove once patternfly-react PR is merged:
//  https://github.com/patternfly/patternfly-react/pull/343

const ModalPattern = ({
  show,
  title,
  onClose,
  footer,
  children,
  ...rest
}) => (
  <Modal show={show} {...rest}>
    <Modal.Header>
      <Modal.CloseButton onClick={onClose} />
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{children}</Modal.Body>
    <Modal.Footer>{footer}</Modal.Footer>
  </Modal>
)

ModalPattern.propTypes = {
  ...Modal.propTypes,
  show: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onClose: PropTypes.func,
  footer: PropTypes.node,
  children: PropTypes.node
}

ModalPattern.defaultProps = {
  ...Modal.defaultProps,
  show: false,
  title: '',
  onClose: noop,
  footer: null,
  children: null
}

export default ModalPattern
