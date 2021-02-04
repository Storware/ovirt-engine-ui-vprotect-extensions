class getPluginApi {
  configObject = () => {
    return {
      username: 'admin',
      password: 'vPr0tect',
      vProtectURL: 'http://localhost:8080/api',
    };
  };
  showToast = (toastType, text) => {
    return null;
  };
}

export default new getPluginApi();
