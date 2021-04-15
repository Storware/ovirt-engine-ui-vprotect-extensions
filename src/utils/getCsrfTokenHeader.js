import getCookie from './getCookie';

export function getCsrfTokenHeader() {
  const token = getCookie('csrftoken');

  if (token) {
    return { 'X-CSRFToken': token };
  }
}
