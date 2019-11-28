import React from 'react'
import PropTypes from 'prop-types'
import c3 from 'c3'
import d3 from 'd3'
import { msg } from '../../intl-messages'
import { getDefaultDonutConfig } from '../../patternfly-defaults'
import { formatNumber1D, formatPercent0D, formatPercent1D } from '../../utils/intl'

// PatternFly reference:
//  http://www.patternfly.org/pattern-library/data-visualization/donut-chart/

// TODO(vs) replace with
//  https://github.com/patternfly/patternfly-react/blob/master/packages/core/src/components/Chart/DonutChart.js

class DonutChart extends React.Component {
  componentDidMount () {
    this._generateChart(this.props)
  }

  componentWillReceiveProps (newProps) {
    this._updateChart(newProps)
  }

  componentWillUnmount () {
    this._destroyChart()
  }

  render () {
    return (
      <div className='donut-chart-pf' style={this.props.containerStyle}>
        <div ref={e => { this._chartContainer = e }} />
      </div>
    )
  }

  _generateChart ({ used, total, unit, thresholds, centerLabel, onDataClick }) {
    const config = Object.assign({}, getDefaultDonutConfig(), {
      bindto: this._chartContainer,
      data: {
        type: 'donut',
        columns: [
          ['used', used],
          ['available', total - used]
        ],
        groups: [
          ['used', 'available']
        ],
        order: null,
        onclick: onDataClick
      },
      color: {
        pattern: this._getDonutChartColorPattern({ used, total, thresholds })
      },
      tooltip: {
        contents (d) {
          const label = d[0].id === 'used' ? msg.used() : msg.available()
          return `<span class='donut-tooltip-pf' style='white-space: nowrap;'>${formatPercent1D(d[0].ratio)} ${label}</span>`
        }
      }
    })

    this._chart = c3.generate(config)
    this._setDonutChartCenterLabel({ used, total, unit, centerLabel })
  }

  _updateChart (props) {
    this._destroyChart()
    this._generateChart(props)
  }

  _destroyChart () {
    this._chart.destroy()
  }

  _getDonutChartColorPattern ({ used, total, thresholds }) {
    const defaultPattern = getDefaultDonutConfig().color.pattern
    if (!thresholds.enabled) {
      return defaultPattern
    }

    const percentUsed = total === 0 ? 0 : used / total * 100
    let color = '#3F9C35'

    if (percentUsed >= thresholds.error) {
      color = '#CC0000'
    } else if (percentUsed >= thresholds.warning) {
      color = '#EC7A08'
    }

    // return new array with first color replaced
    return [color].concat(defaultPattern.slice(1))
  }

  _setDonutChartCenterLabel ({ used, total, unit, centerLabel }) {
    let bigText = ''
    let smallText = ''

    if (centerLabel === 'used') {
      bigText = `${formatNumber1D(used)}`
      smallText = msg.unitUsed({ unit })
    } else if (centerLabel === 'available') {
      bigText = `${formatNumber1D(total - used)}`
      smallText = msg.unitAvailable({ unit })
    } else if (centerLabel === 'percent') {
      bigText = `${formatPercent0D(total === 0 ? 0 : used / total)}`
      smallText = msg.used()
    }

    const chartTitle = d3.select(this._chartContainer).select('text.c3-chart-arcs-title')
    chartTitle.selectAll('*').remove()
    chartTitle.insert('tspan').text(bigText).classed('donut-title-big-pf', true).attr('dy', 0).attr('x', 0)
    chartTitle.insert('tspan').text(smallText).classed('donut-title-small-pf', true).attr('dy', 20).attr('x', 0)
  }
}

// Disable propType checking because the component passes `this.props` to a helper function
// See: https://github.com/yannickcr/eslint-plugin-react/issues/1135
/* eslint-disable react/no-unused-prop-types */
DonutChart.propTypes = {
  used: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  thresholds: PropTypes.shape({
    enabled: PropTypes.bool,
    warning: PropTypes.number,
    error: PropTypes.number
  }),
  centerLabel: PropTypes.oneOf(['used', 'available', 'percent']),
  containerStyle: PropTypes.object,
  onDataClick: PropTypes.func // (d, element) => void
}

DonutChart.defaultProps = {
  thresholds: {
    enabled: true,
    warning: 60,
    error: 90
  },
  centerLabel: 'used',
  containerStyle: {},
  onDataClick () {}
}

export default DonutChart
