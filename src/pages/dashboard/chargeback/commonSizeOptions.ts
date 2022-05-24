import getFileSize from 'utils/getFileSize';
import moment from 'moment-timezone';

const commonProperties = {
  responsive: true,
};

export const commonSizeOptions = (tooltipProperty) => ({
  ...commonProperties,
  plugins: {
    tooltip: {
      callbacks: {
        label: (tooltipItem) =>
          `Size: ${getFileSize(tooltipItem.parsed[tooltipProperty])}`,
      },
    },
  },
});

const duration = (milliseconds) => {
  const dur = moment.duration(milliseconds, 'milliseconds');
  const hours = Math.floor(dur.asHours());
  const mins = Math.floor(dur.asMinutes()) - hours * 60;
  const sec = Math.floor(dur.asSeconds()) - hours * 60 * 60 - mins * 60;
  return (
    (hours > 9 ? hours : '0' + hours) +
    ':' +
    (mins > 9 ? mins : '0' + mins) +
    ':' +
    (sec > 9 ? sec : '0' + sec)
  );
};

export const commonTimeOptions = (tooltipProperty) => ({
  ...commonProperties,
  plugins: {
    tooltip: {
      callbacks: {
        label: (tooltipItem) =>
          (tooltipItem.parsed[tooltipProperty] &&
            ` ${duration(tooltipItem.parsed[tooltipProperty])}`) ||
          null,
      },
    },
  },
});

const commonTickOptions = (elements) => ({
  min: 0,
  max: Math.max(...elements),
  stepSize: Math.max(...elements) / 10,
});

export const tickSizeOptions = (elements) => ({
  ticks: {
    callback: (value) => getFileSize(value),
    ...commonTickOptions(elements),
  },
});

export const tickTimeOptions = (elements) => ({
  ticks: {
    callback: (value) => duration(value),
    ...commonTickOptions(elements),
  },
});
