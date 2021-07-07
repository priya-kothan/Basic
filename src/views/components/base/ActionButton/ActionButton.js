import React from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@material-ui/core'
import './ActionButton.css'

const ActionButton = ({ Label, CSSName = '', onClick, disabled, Icon }) => {
  ActionButton.defaultProps = {
    CSSName: '',
    onClick: () => {},
    disabled: false,
  }

  return (
    <span className={`actionbutton ${CSSName}`}>
      <IconButton
        disableRipple
        className="actionbutton__icon"
        onClick={onClick}
        disabled={disabled}
      >
        <Icon />
        {/* <Icon>
          {' '}
          <AddCircleIcon />
        </Icon> */}
        <span className="actionbutton__iconlabel">{Label}</span>
      </IconButton>
    </span>
  )
}

ActionButton.propTypes = {
  Label: PropTypes.string.isRequired,
  CSSName: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}

export default ActionButton
