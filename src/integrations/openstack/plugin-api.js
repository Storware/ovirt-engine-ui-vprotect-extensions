class getPluginApi {
  configObject = async () => {
    return await fetch("/dashboard/static/config.json")
        .then(response => response.json())
  }
  showToast = (toastType, text) => {
    return null
  }
}

export default new getPluginApi();
