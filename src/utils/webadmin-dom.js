export const getWebAdminWindow = () => {
  return window.top
}

export const getWebAdminDocumentBody = () => {
  return getWebAdminWindow().document.body
}
