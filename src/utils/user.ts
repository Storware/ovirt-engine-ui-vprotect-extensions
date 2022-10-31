export const user = JSON.parse(localStorage.getItem('user'));

export const getUnmountPeriodForMountedBackups = () =>
  user.appUserSettings.unmountPeriodForMountedBackups / (1000 * 60 * 60);
