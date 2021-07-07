import React from 'react'
import AddCircleOutline from '@material-ui/icons/AddCircleOutline'
import PropTypes from 'prop-types'
import './GridAddButton.css'

const GridAddButton = ({ onClickHandler, ...rest }) => {
  return (
    <div className="grid-add-button-root">
      <AddCircleOutline onClick={() => onClickHandler(rest)} />
    </div>
  )
}

GridAddButton.propTypes = {
  onClickHandler: PropTypes.func,
}
GridAddButton.defaultProps = {
  onClickHandler: () => null,
}
export default GridAddButton
