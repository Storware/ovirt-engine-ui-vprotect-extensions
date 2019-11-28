import StatefulModalPattern from './StatefulModalPattern'
import { getWebAdminDocumentBody } from '../../utils/webadmin-dom'

class WebAdminBodyModal extends StatefulModalPattern {
  render () {
    return super.render()
  }
}

WebAdminBodyModal.defaultProps = {
  ...StatefulModalPattern.defaultProps,
  container: getWebAdminDocumentBody()
}

export default WebAdminBodyModal
