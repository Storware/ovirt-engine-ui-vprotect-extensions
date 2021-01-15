function getPluginApi() {
  return {
    configObject: () => {
      return {
        username: 'admin',
        password: 'vPr0tect',
        vProtectURL: 'http://10.40.0.54:8080/api'
      }
    },
    showToast: (toastType, text) => {
      return null
    }
  }
}

export default getPluginApi;
