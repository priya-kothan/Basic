import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import './FFLabel.css'

const FFLabel = ({ text, value }) => {
  return (
    <>
      <div className="summary-item">
        <div className="summary-header">{text}</div>
        <div className="summary-description">{value || ''}</div>
      </div>
    </>
  )
}

FFLabel.propTypes = {
  text: PropTypes.string,
  value: PropTypes.string,
}
FFLabel.defaultProps = {
  text: null,
  value: null,
}

export default FFLabel
