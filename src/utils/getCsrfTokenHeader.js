export function getCsrfTokenHeader() {
  const value = `; ${window.parent.document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  if (parts.length === 2) {
    return { 'X-CSRFToken': parts.pop().split(';').shift() };
  }
}
