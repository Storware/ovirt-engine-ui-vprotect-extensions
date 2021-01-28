class getPluginApi {
  configObject = () => {
    return {
      username: 'admin',
      password: 'vPr0tect',
      vProtectURL: 'https://10.40.0.54:8181/api'
    }
  }
  showToast = (toastType, text) => {
    return null
  }
}

export default new getPluginApi();
