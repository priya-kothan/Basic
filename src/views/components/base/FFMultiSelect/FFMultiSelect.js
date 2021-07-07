import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import { TextField } from '@material-ui/core'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import './FFMultiSelect.css'
import PropTypes from 'prop-types'
// import Chip from '@material-ui/core/Chip'
// import { FFHelpText } from '../FFHelpText/FFHelpText'

let FFSelectdataSource = []

export const FFMultiSelect = ({
  id,
  onChangeHandler,
  value,
  // dataSource,
  disabled,
  // error,
  variant,
  CSSClass,
  Field,
  Screen,
}) => {
  FFSelectdataSource = Field && Field.DataSource
  // eslint-disable-next-line no-unused-vars
  const [DataSource, setDataSource] = React.useState(FFSelectdataSource)

  const [Name, setName] = React.useState(
    Field && Field.DefaultValue === '' ? [] : Field.DefaultValue
  )

  const handleChange = (event) => {
    setName(event.target.value)

    onChangeHandler(event, {
      id: Field?.FieldValue,
      name: Field?.FieldValue,
      value: event.target.value,
    })
  }
  const renderDropdownValue = (selected) => {
    return selected.reduce((preValue, currValue) => {
      currValue = DataSource.filter(
        (val) => val[Field.ValueField] === currValue
      )
      if (currValue.length !== 0)
        return preValue
          ? `${preValue},${currValue[0][Field.TextField]}`
          : currValue[0][Field.TextField]
      return preValue
    }, '')

    // return selected.reduce((preValue, currValue) => {
    //   currValue = DataSource.filter((val) => val.Id === currValue)
    //   return (
    //     <div className="selecteditem">
    //       {selected.map((value) => (
    //         <Chip
    //           key={DataSource.filter((val) => val.Id === value)[0].name}
    //           label={DataSource.filter((val) => val.Id === value)[0].name}
    //           style={{ margin: '2px' }}
    //         />
    //       ))}
    //     </div>
    //   )
    // }, '')
  }

  return (
    <div className={`FFMultiSelect_root ${CSSClass}`}>
      <TextField
        className={`formControl ${CSSClass}`}
        select
        name={id}
        id={id}
        variant={variant || 'filled'}
        disabled={disabled && disabled}
        label={Field && Field.FieldLabel}
        SelectProps={{
          name: id,
          multiple: true,
          value,
          onChange: handleChange,
          renderValue: (selected) => renderDropdownValue(selected),
          MenuProps: {
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          },
        }}
      >
        {DataSource &&
          DataSource.map((name) => (
            <MenuItem
              key={name[Field.ValueField]}
              value={name[Field.ValueField]}
              fieldvalue={Field.FieldValue}
              id={
                Screen
                  ? `${Screen}_MulSel_${name[Field.ValueField]}`
                  : name[Field.ValueField]
              }
              className={
                Screen
                  ? `${Screen}_MulSel_${name[Field.ValueField]}`
                  : name[Field.ValueField]
              }
            >
              <Checkbox checked={Name.indexOf(name[Field.ValueField]) > -1} />
              <ListItemText primary={name[Field.TextField]} />
            </MenuItem>
          ))}
      </TextField>
      {/* {Field &&
        Field.IsEnableHelpText !== 'undefined' &&
        Field.IsEnableHelpText === true && (
          <FFHelpText LongText={Field.HelpText} />
        )} */}
    </div>
  )
}

FFMultiSelect.propTypes = {
  Field: PropTypes.objectOf(PropTypes.any),
  CSSClass: PropTypes.string,
  onChangeHandler: PropTypes.func,
  // onFilterClickHandler: PropTypes.func,
  // value: PropTypes.string,
  Screen: PropTypes.string,
  id: PropTypes.string,
  variant: PropTypes.string,
  // dataSource: PropTypes.arrayOf(PropTypes.array),
  disabled: PropTypes.bool,
  // error: PropTypes.string,
}

FFMultiSelect.defaultProps = {
  Field: {},
  CSSClass: '',
  onChangeHandler: () => null,
  // onFilterClickHandler: () => null,
  // value: '',
  Screen: '',
  id: '',
  variant: 'filled',
  // dataSource: [],
  disabled: false,
  // error: '',
}

export default FFMultiSelect
