import React from 'react'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'

import './FFButton.css'

const FFButton = ({ Field, className, onClickHandler }) => {
  return (
    <Button
      id={Field.FieldValue}
      disableRipple
      disableElevation
      className={`button btn--${Field?.Type || 'primary'} ${className || ''}`}
      variant={Field && Field.Variant}
      disabled={Field?.Disabled}
      onClick={onClickHandler}
    >
      {Field?.FieldLabel}
    </Button>
  )
}

FFButton.propTypes = {
  Field: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  onClickHandler: PropTypes.func,
}

FFButton.defaultProps = {
  Field: {},
  className: '',
  onClickHandler: () => null,
}

export default FFButton
