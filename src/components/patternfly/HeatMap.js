import React from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import d3 from 'd3'

// PatternFly reference:
//  http://www.patternfly.org/pattern-library/data-visualization/heat-map/

// TODO(vs) rewrite in pure React & consider contributing to patternfly-react

class HeatMap extends React.Component {
  componentDidMount () {
    this._generateHeatMap(this.props)
  }

  componentWillReceiveProps (newProps) {
    this._updateHeatMap(newProps)
  }

  render () {
    return (
      <div className='heatmap-container' style={this.props.containerStyle} ref={e => { this._heatMapContainer = e }}>
        <svg className='heatmap-svg' />
      </div>
    )
  }

  _generateHeatMap ({ data, thresholds, maxBlockSize, blockPadding, onBlockClick }) {
    const containerWidth = this._heatMapContainer.clientWidth
    const containerHeight = this._heatMapContainer.clientHeight

    const blockSize = this._determineBlockSize({
      containerWidth,
      containerHeight,
      numberOfBlocks: data.length,
      maxBlockSize
    })

    const numberOfRows = (blockSize === 0) ? 0 : Math.floor(containerHeight / blockSize)
    const color = d3.scale.threshold().domain(thresholds.domain).range(thresholds.colors)

    function highlightBlock (block, active) {
      block.style('fill-opacity', active ? 1 : 0.4)
    }

    const svg = d3.select(this._heatMapContainer).select('svg.heatmap-svg')
    svg.selectAll('*').remove()

    // generate heat map blocks
    const blocks = svg.selectAll('rect').data(data).enter().append('rect')
    blocks
      .attr('x', (d, i) => (Math.floor(i / numberOfRows) * blockSize) + blockPadding)
      .attr('y', (d, i) => (i % numberOfRows * blockSize) + blockPadding)
      .attr('width', blockSize - (2 * blockPadding))
      .attr('height', blockSize - (2 * blockPadding))
      .style('fill', d => color(d.value))
      .attr('data-index', (d, i) => i)
      .attr('data-role', 'heat-map-block')

    // attach event listeners
    blocks.on('mouseover', function () {
      blocks.call(highlightBlock, false)
      d3.select(this).call(highlightBlock, true)
    })
    blocks.on('click', d => { onBlockClick(d) })
    svg.on('mouseleave', () => { blocks.call(highlightBlock, true) })

    // tooltips are done via jQuery
    $('rect[data-role=heat-map-block]', this._heatMapContainer).tooltip({
      animation: false,
      container: 'body',
      title () {
        return data[$(this).attr('data-index')].name
      }
    })
  }

  _updateHeatMap (props) {
    this._generateHeatMap(props)
  }

  _determineBlockSize ({ containerWidth, containerHeight, numberOfBlocks, maxBlockSize }) {
    const x = containerWidth
    const y = containerHeight
    const n = numberOfBlocks
    const px = Math.ceil(Math.sqrt(n * x / y))
    const py = Math.ceil(Math.sqrt(n * y / x))

    let sx
    if (Math.floor(px * y / x) * px < n) {
      sx = y / Math.ceil(px * y / x)
    } else {
      sx = x / px
    }

    let sy
    if (Math.floor(py * x / y) * py < n) {
      sy = x / Math.ceil(x * py / y)
    } else {
      sy = y / py
    }

    sx = Math.min(sx, maxBlockSize)
    sy = Math.min(sy, maxBlockSize)

    return Math.max(sx, sy)
  }
}

/* eslint-disable react/no-unused-prop-types */
HeatMap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number, // from range <0, 1>
    name: PropTypes.string
  })).isRequired,
  thresholds: PropTypes.shape({
    domain: PropTypes.arrayOf(PropTypes.number), // threshold scale domain
    colors: PropTypes.arrayOf(PropTypes.string)  // threshold scale color range
  }),
  maxBlockSize: PropTypes.number,
  blockPadding: PropTypes.number,
  containerStyle: PropTypes.object,
  onBlockClick: PropTypes.func // (dataItem:object) => void
}

HeatMap.defaultProps = {
  thresholds: {
    domain: [0.7, 0.8, 0.9],
    colors: ['#D4F0FA', '#F9D67A', '#EC7A08', '#CE0000']
  },
  maxBlockSize: 50,
  blockPadding: 1,
  containerStyle: {
    height: 100
  },
  onBlockClick () {}
}

export default HeatMap
