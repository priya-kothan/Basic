import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox as MuiCheckbox, FormControlLabel } from '@material-ui/core'

import './FFCheckbox.css'

function FFCheckbox({ className, Field, onChangeHandler }) {
  function onChange(event) {
    if (onChangeHandler)
      onChangeHandler(event, {
        id: Field?.FieldValue,
        value: event.target.checked,
      })
  }

  function Checkbox() {
    return (
      <MuiCheckbox
        id={Field?.FieldValue}
        name={Field?.name || Field?.FieldValue}
        disableRipple
        color="default"
        checked={Field?.Checked}
        onChange={onChange}
        disabled={Field?.Disabled}
        defaultChecked={Field?.DefaultChecked}
        className={className}
      />
    )
  }

  if (!Field?.FieldLabel) return <Checkbox />

  return <FormControlLabel control={<Checkbox />} label={Field.FieldLabel} />
}

FFCheckbox.defaultProps = {
  className: '',
  onChangeHandler: () => {},
}

FFCheckbox.propTypes = {
  Field: PropTypes.shape({
    FieldValue: PropTypes.string.isRequired,
    name: PropTypes.string,
    FieldLabel: PropTypes.string,
    Checked: PropTypes.bool,
    Disabled: PropTypes.bool,
    DefaultChecked: PropTypes.bool,
  }).isRequired,
  onChangeHandler: PropTypes.func,
  className: PropTypes.string,
}

export default FFCheckbox
