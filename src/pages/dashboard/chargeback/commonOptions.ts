import getFileSize from 'utils/getFileSize';

export const commonOptions = (tooltipProperty) => {
  return {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          return `Size: ${getFileSize(tooltipItem[tooltipProperty])}`;
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
