import React from 'react'
import PropTypes from 'prop-types'
import { ResizeSensor } from 'css-element-queries'
import debounce from 'lodash/debounce'

class HeightMatching extends React.Component {
  constructor (props) {
    super(props)
    this._selectors = Array.isArray(props.selector) ? props.selector : [ props.selector ]
    this._resizeSensors = []
  }

  componentDidMount () {
    // setup the event listening on '_container' for our height matching selectors
    this._selectors.forEach(selector => {
      const elements = this._container.querySelectorAll(selector)
      this._resizeSensors.push(new ResizeSensor(elements,
        debounce(() => { this._matchHeights([selector]) }, 200)
      ))
    })

    // schedule the initial height matching
    setTimeout(() => { this._matchHeights() }, 0)
  }

  componentDidUpdate () {
    // if the container got updated, let's match heights again
    setTimeout(() => { this._matchHeights() }, 0)
  }

  componentWillUnmount () {
    this._resizeSensors.forEach(sensor => { sensor.detach() })
  }

  _getMaxHeight (elements) {
    return Array.prototype.map.call(elements, el => el.scrollHeight).reduce((pre, cur) => Math.max(pre, cur), -Infinity)
  }

  _matchHeights (selectors = this._selectors) {
    selectors.forEach(selector => {
      const elements = this._container.querySelectorAll(selector)
      elements.forEach(el => { el.style.height = null })
      const maxHeight = this._getMaxHeight(elements)
      elements.forEach(el => { el.style.height = `${maxHeight}px` })
    })
  }

  render () {
    return (
      <div className={this.props.className} ref={node => { this._container = node }}>
        {this.props.children}
      </div>
    )
  }
}

HeightMatching.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  selector: PropTypes.oneOfType([ PropTypes.string, PropTypes.arrayOf(PropTypes.string) ]).isRequired
}

export default HeightMatching
