import { Store } from 'react-notifications-component';

class getPluginApi {
  configObject = async () => ({
    vProtectURL: `${window.parent.origin}/dashboard/vprotect/api`,
  });
  showToast = (toastType, text) => {
    Store.addNotification({
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
