import React from 'react'
import PropTypes from 'prop-types'

class DataProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: null,
      fetchError: null,
      fetchInProgress: false,
      lastUpdated: null
    }
  }

  componentDidMount () {
    if (this.props.fetchOnMount) {
      this.fetchAndUpdateData()
    }
  }

  render () {
    return this.props.children({
      ...this.state,
      fetchAndUpdateData: () => { this.fetchAndUpdateData() }
    })
  }

  fetchAndUpdateData () {
    this.onFetchStart()
    this.props.fetchData()
      .then(data => {
        this.onFetchSuccess(data)
      })
      .catch(error => {
        console.error('DataProvider failed to fetch data', error)
        this.onFetchError(error)
      })
  }

  onFetchStart () {
    this.setState({
      fetchError: null,
      fetchInProgress: true
    })
  }

  onFetchSuccess (data) {
    this.setState({
      data,
      fetchError: null,
      fetchInProgress: false,
      lastUpdated: new Date()
    })
  }

  onFetchError (error) {
    this.setState({
      data: null,
      fetchError: error,
      fetchInProgress: false,
      lastUpdated: new Date()
    })
  }
}

DataProvider.propTypes = {
  fetchData: PropTypes.func,
  fetchOnMount: PropTypes.bool,
  children: PropTypes.func
}

DataProvider.defaultProps = {
  fetchData: () => Promise.resolve({}),
  fetchOnMount: true,
  children: () => null
}

export default DataProvider
