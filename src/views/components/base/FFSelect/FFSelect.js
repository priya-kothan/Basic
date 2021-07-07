import React, { Fragment, useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputBase from '@material-ui/core/InputBase'
// import Alert from '@material-ui/lab/Alert'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import './FFSelect.css'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'
import FFHelpText from '../FFHelpText/FFHelpText'
import getValidator from '../FFValidator/Validator'

import { MaterialIconAsync } from '../../../../utils/DatatypeIconData'

// TODO: Amar, cleanup this widget.
// eslint-disable-next-line no-unused-vars
const BootstrapInput = withStyles((theme) => ({
  input: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    padding: '0.36vw 1.20vw',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase)

const defaultvalueload = []
let FFSelectdataSource = []

const FFSelect = ({
  value,
  onChangeHandler,
  id,
  CSSClass,
  Field,
  disabled,
  variants,
  forceFieldValidation,
  onFilterValueChangedHandler,
  OnFieldValidation,
  Screen,
  ...rest
}) => {
  FFSelectdataSource = Field
    ? defaultvalueload.concat(Field.DataSource)
    : defaultvalueload

  const Fieldval = Field

  if (Fieldval && Fieldval.DefaultValue === '') {
    Fieldval.DefaultValue = 'All'
  }
  const [Name, setName] = React.useState(
    value || (Fieldval ? Fieldval.DefaultValue : '')
  )
  const [validatormessage, setvalidatormessage] = useState(null)
  const [isErrorClass, setErroCclass] = useState('false')

  function submitvalidation() {
    let ValidationisVaild = true
    // eslint-disable-next-line no-undef
    const textboxdata = $(`#${Fieldval.FieldValue}`).text()
    if (Fieldval.Validation && Fieldval.Validation.ValidationCondition !== '') {
      const validatorfunction = getValidator(
        Fieldval.Validation.ValidationCondition
      )
      let isVaild = validatorfunction(textboxdata)
      if (isVaild !== '') {
        setErroCclass('true')
        if (Fieldval.Validation.ValidationText !== null) {
          isVaild = Fieldval.Validation.ValidationText
        }
        setvalidatormessage(isVaild)
        ValidationisVaild = false
      } else {
        setErroCclass('false')
        setvalidatormessage('')
        ValidationisVaild = true
      }
      const params = { id: Fieldval.FieldValue, isValidData: ValidationisVaild }
      if (OnFieldValidation) OnFieldValidation(params)
    }
  }
  useEffect(() => {
    if (forceFieldValidation === true) submitvalidation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceFieldValidation])

  const handleChange = (event, fieldValue) => {
    setName(event.target.value)
    let ValidationisVaild = true
    const textboxdata =
      typeof event.target === 'undefined' || event.target === 'undefined'
        ? event
        : event.target.value
    if (Fieldval.Validation && Fieldval.Validation.ValidationCondition !== '') {
      const validatorfunction = getValidator(
        Fieldval.Validation.ValidationCondition
      )
      if (validatorfunction !== undefined) {
        let isVaild = validatorfunction(textboxdata)
        if (isVaild !== '') {
          setErroCclass('true')
          if (Fieldval.Validation.ValidationText !== null) {
            isVaild = Fieldval.Validation.ValidationText
          }
          ValidationisVaild = false
          setvalidatormessage(isVaild)
        } else {
          setErroCclass('false')
          ValidationisVaild = true
          setvalidatormessage('')
        }
      }
    }
    const params = {
      event,
      id: Fieldval.FieldValue,
      isValidData: ValidationisVaild,
    }

    if (onChangeHandler) onChangeHandler(event, params)
    if (onFilterValueChangedHandler)
      onFilterValueChangedHandler(fieldValue, event.target.value, '', params)
  }

  return (
    <div
      className={`FFSelect_root ${CSSClass}`}
      error={isErrorClass === 'false' ? '' : ' '}
    >
      <>
        <FormControl
          variant={variants === undefined ? 'outlined' : variants}
          className={`formControl ${CSSClass}`}
        >
          <InputLabel
            id={Fieldval.FieldValue}
            error={isErrorClass === 'false' ? '' : ' '}
            required={
              Fieldval &&
              Fieldval.Validation &&
              Fieldval.Validation.IsRequired === 'False'
                ? ''
                : ' '
            }
          >
            {Fieldval && Fieldval.FieldLabel}
          </InputLabel>
          <Select
            id={id}
            value={value} // {Name}
            onChange={(event) => handleChange(event, Fieldval.FieldValue)}
            className="FFSelect"
            error={isErrorClass === 'false' ? '' : ' '}
            required={
              Fieldval &&
              Fieldval.Validation &&
              Fieldval.Validation.IsRequired &&
              Fieldval.Validation.IsRequired === ''
                ? ''
                : ''
            }
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
            }}
            {...rest}
            disabled={disabled}
          >
            {FFSelectdataSource &&
              FFSelectdataSource.map((values) => {
                if (values.Icon) {
                  return (
                    <MenuItem
                      key={values.Id}
                      value={values.Id}
                      fieldvalue={Fieldval && Fieldval.FieldValue}
                      id={Screen ? `${Screen}_drp_${values.Id}` : values.Id}
                      className={
                        Screen ? `${Screen}_drp_${values.Id}` : values.Id
                      }
                    >
                      <Grid container className="iconselect">
                        <Grid item xs={1.5}>
                          <MaterialIconAsync icon={values.Icon} />
                        </Grid>
                        <Grid item xs={6}>
                          &nbsp; {values.Name}
                        </Grid>
                      </Grid>
                    </MenuItem>
                  )
                }
                return (
                  <MenuItem
                    key={values.Id}
                    value={values.Id}
                    disabled={values.disabled && values.disabled}
                    fieldvalue={Fieldval && Fieldval.FieldValue}
                    id={Screen ? `${Screen}_drp_${values.Id}` : values.Id}
                    className={
                      Screen ? `${Screen}_drp_${values.Id}` : values.Id
                    }
                  >
                    {values.Name}
                  </MenuItem>
                )
              })}
          </Select>
        </FormControl>

        {Fieldval &&
          Fieldval.IsEnableHelpText !== 'undefined' &&
          Fieldval.IsEnableHelpText === true && (
            <FFHelpText LongText={Fieldval.HelpText} />
          )}
        <br />
        <span className="error">{validatormessage}</span>
      </>
    </div>
  )
}

FFSelect.propTypes = {
  Field: PropTypes.objectOf(PropTypes.object),
  CSSClass: PropTypes.string,
  onChangeHandler: PropTypes.func,
  onFilterValueChangedHandler: PropTypes.func,
  OnFieldValidation: PropTypes.func,
  value: PropTypes.string,
  Screen: PropTypes.string,
  id: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.array),
  disabled: PropTypes.string,
  variants: PropTypes.string,
  error: PropTypes.string,
  forceFieldValidation: PropTypes.bool,
}
FFSelect.defaultProps = {
  Field: {},
  CSSClass: '',
  onChangeHandler: () => null,
  onFilterValueChangedHandler: () => null,
  OnFieldValidation: () => null,
  value: '',
  Screen: '',
  id: '',
  dataSource: [],
  disabled: '',
  variants: 'outlined',
  error: '',
  forceFieldValidation: false,
}

export default FFSelect
