export default () => {
  const pathParts = location.pathname.split('/');
  return pathParts[pathParts.length - 1];
};
