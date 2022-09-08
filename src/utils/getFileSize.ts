const sufixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export default (bytes = 0, precision = 2) => {
  if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
    return '?';
  }
  let unit = 0;

  while (bytes >= 1024) {
    bytes /= 1024;
    unit++;
  }

  return bytes.toFixed(+precision) + ' ' + sufixes[unit];
};
