import React from 'react'
import PropTypes from 'prop-types'
import './StyledText.css'

const StyledText = (props) => {
  const { value, colDef } = props

  return (
    <div
      className={`${colDef.cellCSSClass ? colDef.cellCSSClass : ''} ${
        colDef.valueCSSClass ? colDef.valueCSSClass[value] : ''
      }`}
    >
      {value}
    </div>
  )
}

StyledText.propTypes = {
  value: PropTypes.string,
  colDef: PropTypes.objectOf(PropTypes.object),
}
StyledText.defaultProps = {
  value: null,
  colDef: {},
}
export default StyledText
