const sufixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
export default (bytes) => {
  if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
    return 0;
  }

  let unit = 0;

  while (bytes >= 1024) {
    bytes /= 1024;
    unit++;
  }

  return bytes.toFixed(2) + ' ' + sufixes[unit];
};
