export function getProjectIdCookie() {
  const value = `; ${window.parent.document.cookie}`;
  const parts = value.split(`; recent_project=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
