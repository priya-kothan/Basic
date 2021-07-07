import React from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@material-ui/core'
import { Edit as EditIcon } from '@material-ui/icons'

import './ListViewDesignerGridHeader.css'

const ListViewDesignerGridHeader = ({
  displayName,
  column,
  onEditClickHandler,
}) => {
  return (
    <div
      role="presentation"
      className="listviewdesigner-header"
      onClick={() => onEditClickHandler(column.colDef)}
    >
      <span className="listviewdesigner-header__text">{displayName}</span>
    </div>
  )
}

ListViewDesignerGridHeader.defaultProps = {
  onEditClickHandler: () => {},
  column: {},
}

ListViewDesignerGridHeader.propTypes = {
  displayName: PropTypes.string.isRequired,
  column: PropTypes.shape({ colDef: PropTypes.shape({}) }),
  onEditClickHandler: PropTypes.func,
}

export default ListViewDesignerGridHeader
