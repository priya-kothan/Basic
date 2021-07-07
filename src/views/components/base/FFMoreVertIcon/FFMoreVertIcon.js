import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVert from '@material-ui/icons/MoreVert'
import Fade from '@material-ui/core/Fade'
import PropTypes from 'prop-types'

import './FFMoreVertIcon.css'

const FFMoreVertIcon = ({ data, RowActions, rowIndex }) => {
  const [anchorEl, setAnchorEl] = React.useState(false)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(false)
  }

  return (
    <>
      <IconButton
        className="morevert-icon"
        disableRipple
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        disabled={data?.addmode && data?.addmode}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={anchorEl}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {RowActions &&
          RowActions.map((action) => (
            <MenuItem
              key={action.ActionName}
              onClick={() => {
                action.ActionHandler(data, rowIndex)
                handleClose()
              }}
            >
              {action.ActionName}
            </MenuItem>
          ))}
      </Menu>
    </>
  )
}

FFMoreVertIcon.propTypes = {
  data: PropTypes.objectOf(PropTypes.object),
  RowActions: PropTypes.func,
  rowIndex: PropTypes.string,
}
FFMoreVertIcon.defaultProps = {
  data: {},
  RowActions: () => null,
  rowIndex: null,
}
export default FFMoreVertIcon
