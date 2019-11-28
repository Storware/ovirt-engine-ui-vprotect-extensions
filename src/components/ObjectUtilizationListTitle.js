import React from 'react'
import PropTypes from 'prop-types'

const ObjectUtilizationListTitle = ({ text }) => {
  return (
    <div className='row row-tile-pf'>
      <div className='col-md-12'>
        <div>{text}</div>
      </div>
    </div>
  )
}

ObjectUtilizationListTitle.propTypes = {
  text: PropTypes.string.isRequired
}

export default ObjectUtilizationListTitle
