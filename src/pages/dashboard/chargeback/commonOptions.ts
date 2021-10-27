import getFileSize from 'utils/getFileSize';

export const commonOptions = (tooltipProperty) => {
  return {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `Size: ${getFileSize(tooltipItem.parsed[tooltipProperty])}`;
          },
        },
      },
    },
  };
};

export const tickOptions = (elements) => {
  return {
    ticks: {
      callback: (value) => {
        return getFileSize(value);
      },
      min: 0,
      max: Math.max(...elements),
      stepSize: Math.max(...elements) / 10,
    },
  };
};
