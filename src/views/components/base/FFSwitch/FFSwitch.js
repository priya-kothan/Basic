import React from 'react'
import PropTypes from 'prop-types'
import { Switch } from '@material-ui/core'

import './FFSwitch.css'

const FFSwitch = ({ Field, value, onChangeHandler }) => {
  function onChange(event) {
    if (onChangeHandler)
      onChangeHandler(event, {
        id: Field?.FieldValue,
        value: event.target.checked,
      })
  }

  return (
    <div className="switch">
      <div className={`switch__label ${Field.className}`}>
        {Field?.FieldLabel}
      </div>
      <div className={`switch__input `}>
        <Switch
          id={Field?.FieldValue}
          color="primary"
          checked={value}
          defaultChecked={Field?.DefaultValue}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

FFSwitch.defaultProps = {
  Field: PropTypes.shape({
    FieldLabel: '',
    DefaultValue: false,
  }),
  value: false,
  onChangeHandler: () => null,
}

FFSwitch.propTypes = {
  Field: PropTypes.shape({
    FieldValue: PropTypes.string,
    FieldLabel: PropTypes.string,
    DefaultValue: PropTypes.bool,
  }),
  value: PropTypes.bool,
  onChangeHandler: () => null,
}

export default FFSwitch
