import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { getWebAdminDocumentBody } from '../../utils/webadmin-dom'

/**
 * Renders component's children into WebAdmin document body.
 */
const WebAdminBodyPortal = ({ children }) => {
  return ReactDOM.createPortal(children, getWebAdminDocumentBody())
}

WebAdminBodyPortal.propTypes = {
  children: PropTypes.node
}

export default WebAdminBodyPortal
