import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'primereact/chart';
import { barChartColors } from './colors';
import moment from 'moment-timezone';

const getMaxValue = (props) => {
  let maxValue = Math.max(...props.data.datasets[0].data);
  if (typeof props.data.datasets[1] !== 'undefined') {
    maxValue = Math.max(maxValue, ...props.data.datasets[1].data);
  }
  return maxValue;
};

const prepareChart = {
  size: (props, state) => {
    const maxValue = getMaxValue(props);
    const baseNumber = Math.pow(10, maxValue.toString().length - 1);
    let stepSize = 1024;
    let unit = '\u00A0KiB';
    let rate = 1024;

    if (baseNumber > 1024) {
      stepSize = (Math.ceil(maxValue / baseNumber) * baseNumber * 1.024) / 5;
    }

    if (maxValue > 1024 * 1024) {
      unit = '\u00A0MiB';
      rate = 1024 * 1024;
      stepSize =
        (Math.ceil(maxValue / baseNumber) * baseNumber * 1.024 * 1.024) / 5;
    }
    if (maxValue > 1024 * 1024 * 1024) {
      unit = '\u00A0GiB';
      rate = 1024 * 1024 * 1024;
      stepSize =
        (Math.ceil(maxValue / baseNumber) *
          baseNumber *
          1.024 *
          1.024 *
          1.024) /
        5;
    }
    if (maxValue > 1024 * 1024 * 1024 * 1024) {
      unit = '\u00A0TiB';
      rate = 1024 * 1024 * 1024 * 1024;
      stepSize =
        (Math.ceil(maxValue / baseNumber) *
          baseNumber *
          1.024 *
          1.024 *
          1.024 *
          1.024) /
        5;
    }

    return {
      ...state,
      options: {
        scaleShowVerticalLines: false,
        responsive: true,
        tooltips: {
          callbacks: {
            label: (tooltipItem) => {
              let label = 'Size: ';
              label += Math.round((tooltipItem.yLabel / rate) * 100) / 100;
              label += unit;
              return label;
            },
          },
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                scaleOverride: true,
                stepSize: stepSize,
                callback: (value, index, values) => {
                  return Math.round((value / rate) * 100) / 100 + unit;
                },
              },
            },
          ],
        },
      },
    };
  },
  time: (props, state) => {
    const maxValue = getMaxValue(props);
    const baseNumber = Math.pow(10, maxValue.toString().length - 1);
    let stepSize = 1000;
    if (baseNumber > 1000) {
      stepSize = (Math.ceil(maxValue / baseNumber) * baseNumber) / 2;
    }
    let unit = '\u00A0s';
    let rate = 1000;
    if (maxValue > 1000 * 60) {
      unit = '\u00A0m';
      rate = 1000 * 60;
      stepSize = (Math.ceil(maxValue / baseNumber) * baseNumber * 0.6) / 2;
    }
    if (maxValue > 1000 * 60 * 60) {
      unit = '\u00A0h';
      rate = 1000 * 60 * 60;
      stepSize =
        (Math.ceil(maxValue / baseNumber) * baseNumber * 0.6 * 0.6) / 2;
    }

    return {
      ...state,
      options: {
        scaleShowVerticalLines: false,
        responsive: true,
        tooltips: {
          mode: 'index',
          bodyFontFamily: "'Roboto', 'Helvetica Neue', Arial, monospace",
          footerMarginTop: 1,
          callbacks: {
            label: (tooltipItem) => {
              return tooltipItem.yLabel
                ? ` ${duration(tooltipItem.yLabel)}`
                : null;
            },
            footer: (data) => {
              return `     ${duration(
                data.map((el) => el.yLabel).reduce((a, b) => a + b, 0),
              )}`;
            },
          },
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                scaleOverride: true,
                stepSize: stepSize,
                callback: (value, index, values) => {
                  return Math.round((value / rate) * 100) / 100 + unit;
                },
              },
            },
          ],
        },
      },
    };
  },
};

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

export class BarChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static getDerivedStateFromProps(props, state) {
    return prepareChart[props.chartType](props, state);
  }

  render() {
    return (
      <div>
        <Chart
          type="bar"
          data={this.props.data}
          colors={barChartColors}
          options={this.state.options}
        />
      </div>
    );
  }
}

export default BarChart;

BarChart.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  data: PropTypes.any,
  // unitsType: PropTypes.string.isRequired,
  chartType: PropTypes.string.isRequired,
};
