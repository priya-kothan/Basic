import React from 'react'
import { IconButton } from '@material-ui/core'
import PropTypes from 'prop-types'

import './IconCell.css'

const IconCell = ({ data, IconComponent, onClickHandler, node }) => {
  if (data)
    return (
      <IconButton
        className="iconcell"
        disableRipple
        onClick={(event) => onClickHandler(event, data, node)}
        disabled={data?.addmode && data?.addmode}
      >
        <IconComponent />
      </IconButton>
    )
  return <img src="https://www.ag-grid.com/example-assets/loading.gif"></img>
}

IconCell.defaultProps = {
  onClickHandler: () => null,
  data: {},
}

IconCell.propTypes = {
  IconComponent: PropTypes.node.isRequired,
  onClickHandler: PropTypes.func,
  data: PropTypes.instanceOf(PropTypes.object),
}

IconCell.defaultProps = {}

export default IconCell
