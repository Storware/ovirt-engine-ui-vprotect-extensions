import { store } from 'react-notifications-component';

class getPluginApi {
  configObject = async () => {
    return await fetch('/dashboard/static/config.json').then((response) =>
      response.json(),
    );
  };
  showToast = (toastType, text) => {
    store.addNotification({
      message: text,
      type: toastType,
      insert: 'top',
      container: 'bottom-right',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 3000,
        onScreen: true,
      },
    });
  };
}

export default new getPluginApi();
