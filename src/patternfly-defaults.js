// utility methods adapted from angular-patternfly.js

export function getDefaultDonutConfig () {
  return {
    donut: {
      label: {
        show: false
      },
      width: 11
    },
    size: {
      height: 171
    },
    legend: {
      show: false
    },
    color: {
      pattern: ['#0088CE', '#D1D1D1']
    }
  }
}

export function getDefaultSparklineConfig () {
  return {
    area: {
      zerobased: true
    },
    size: {
      height: 60
    },
    color: {
      pattern: ['#0088CE', '#00659C', '#3F9C35', '#EC7A08', '#CC0000']
    },
    legend: {
      show: false
    },
    point: {
      r: 1,
      focus: {
        expand: {
          r: 4
        }
      }
    }
  }
}
