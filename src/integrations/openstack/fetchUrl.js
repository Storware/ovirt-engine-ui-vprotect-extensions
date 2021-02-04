import { getProjectIdCookie } from 'utils/getProjectIdCookie';

export const fetchUrl = (vProtectUrl, path) => {
  return `${vProtectUrl + path}${
    path.includes('?') ? '&' : '?'
  }projectId=${getProjectIdCookie()}`;
};
