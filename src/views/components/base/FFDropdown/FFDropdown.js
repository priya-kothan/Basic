import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core'

import './FFDropdown.css'

// TODO : Need to combine both FFSelect & FFDropdown as a single component
const FFDropdown = ({ className, Field, value, onChangeHandler, variant }) => {
  function onChange(event) {
    if (onChangeHandler)
      onChangeHandler(event, {
        id: Field?.FieldValue,
        value: event.target.value,
      })
  }

  return (
    <div className="autocompletectrl">
      {Field.className === 'Formviwer' ? (
        <span className="FormviwerFFDropdown-Label">
          {' '}
          {Field && Field.FieldLabel}
        </span>
      ) : (
        ''
      )}
      <FormControl
        size="small"
        variant={variant || 'filled'}
        className="dropdown"
      >
        <InputLabel id="demo-simple-select-outlined-label">
          {Field.className === 'Formviwer' ? '' : Field?.FieldLabel}
        </InputLabel>
        <Select
          id={Field?.FieldValue}
          // className={`${className || ''}`}
          className={`${Field.className} ${className}`}
          // variant={variant || 'filled'}
          variant={
            Field.className === 'Formviwer' ? 'standard' : variant || 'filled'
          }
          onChange={onChange}
          // label={Field?.FieldLabel}
          label={
            Field.className === 'Formviwer'
              ? 'standard'
              : Field && Field.FieldLabel
          }
          disabled={Field?.Disabled}
          defaultValue={Field?.DefaultValue}
          value={value}
          disableUnderline={Field.className === 'Formviwer'}
        >
          {Field.Datasource &&
            Field.Datasource.map((option) => {
              return (
                <MenuItem
                  key={option[Field.ValueField]}
                  value={option[Field.ValueField]}
                >
                  {option[Field.TextField]}
                </MenuItem>
              )
            })}
        </Select>
      </FormControl>
    </div>
  )
}

FFDropdown.defaultProps = {
  className: '',
  value: '',
  onChangeHandler: () => {},
}

FFDropdown.propTypes = {
  Field: PropTypes.shape({
    FieldValue: PropTypes.string.isRequired,
    FieldLabel: PropTypes.string,
    TextField: PropTypes.string,
    ValueField: PropTypes.string,
    Datasource: PropTypes.arrayOf(PropTypes.object),
    Disabled: PropTypes.bool,
  }).isRequired,
  value: PropTypes.string,
  onChangeHandler: PropTypes.func,
  className: PropTypes.string,
}

export default FFDropdown
