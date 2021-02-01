export const fetchUrl = (vProtectUrl, path, projectId) => {
  return `${vProtectUrl + path}${
    path.includes('?') ? '&' : '?'
  }projectId=${projectId}`;
};
