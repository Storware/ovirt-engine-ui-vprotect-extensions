import ReactDOM from 'react-dom'
import uniqueId from 'lodash/uniqueId'

import { getWebAdminWindow } from './webadmin-dom'

/**
 * Render patternfly-react `Modal` based component into WebAdmin document body.
 *
 * @example
 * ```
 * showModal(({ container, destroyModal }) => (
 *   <MyModal show container={container} onExited={destroyModal} />
 * ))
 * ```
 */
export const showModal = (modalCreator, modalId = uniqueId()) => {
  const modalRoot = document.createElement('div')
  modalRoot.setAttribute('id', modalId)

  const targetWindow = getWebAdminWindow()
  targetWindow.document.body.appendChild(modalRoot)

  const clonedStyles = []
  if (window !== targetWindow) {
    window.document.querySelectorAll('head style, head link[type="text/css"], head link[rel="stylesheet"]').forEach(style => {
      const cloned = style.cloneNode(true)
      cloned.setAttribute('data-style-for', modalId)
      clonedStyles.push(cloned)
      targetWindow.document.head.appendChild(cloned)
    })
  }

  const destroyModal = () => {
    ReactDOM.unmountComponentAtNode(modalRoot)
    targetWindow.document.body.removeChild(modalRoot)
    clonedStyles.forEach(style => {
      targetWindow.document.head.removeChild(style)
    })
  }

  ReactDOM.render(
    modalCreator({ container: modalRoot, destroyModal }),
    modalRoot
  )
}
