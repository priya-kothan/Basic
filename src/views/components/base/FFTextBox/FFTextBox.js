import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types'
import FFHelpText from '../FFHelpText/FFHelpText'
import getValidator from '../FFValidator/Validator'

import './FFTextBox.css'

const FFTextBox = ({
  value,
  type,
  id,
  cssClass,
  className,
  Screen,
  // error,
  // required,
  Length,
  onChangeHandler,
  Field,
  forceFieldValidation,
  onFilterValueChangedHandler,
  OnFieldValidation,
  variant,
  ...rest
}) => {
  const [validatormessage, setvalidatormessage] = useState(null)
  const [isErrorClass, setErroClass] = useState('false')

  function submitvalidation() {
    let ValidationisVaild = true
    // eslint-disable-next-line no-undef
    const textboxdata = $(`#txt_${Field.FieldValue}`).val()
    if (
      Field &&
      Field.Validation &&
      Field.Validation.ValidationCondition !== ''
    ) {
      const validatorfunction = getValidator(
        Field.Validation.ValidationCondition
      )
      let isVaild = validatorfunction(textboxdata)
      if (isVaild !== '') {
        setErroClass('true')
        if (Field.Validation.ValidationText !== null) {
          isVaild = Field.Validation.ValidationText
        }
        setvalidatormessage(isVaild)
        ValidationisVaild = false
      } else {
        setErroClass('false')
        setvalidatormessage('')
        ValidationisVaild = true
      }
      const params = { id: Field.FieldValue, isValidData: ValidationisVaild }
      if (OnFieldValidation) OnFieldValidation(params)
    }
  }

  useEffect(() => {
    if (forceFieldValidation === true) submitvalidation()
  }, [forceFieldValidation])

  function onChange(event) {
    let ValidationisVaild = true
    const textboxdata =
      typeof event.target === 'undefined' || event.target === 'undefined'
        ? event
        : event.target.value
    if (
      Field &&
      Field.Validation &&
      Field.Validation.ValidationCondition !== ''
    ) {
      const validatorfunction = getValidator(
        Field.Validation.ValidationCondition
      )
      let isVaild = validatorfunction(textboxdata)
      if (isVaild !== '') {
        setErroClass('true')
        if (Field.Validation.ValidationText !== '') {
          isVaild = Field.Validation.ValidationText
        }
        setvalidatormessage(isVaild)
        ValidationisVaild = false
      } else {
        setErroClass('false')
        setvalidatormessage('')
        ValidationisVaild = true
      }
    }
    const params = {
      event,
      id: Field.FieldValue,
      value:
        Field.Type === 'number'
          ? Number(event.target.value)
          : event.target.value,
      isValidData: ValidationisVaild,
    }
    if (onChangeHandler) onChangeHandler(event, params)
    // if (onFilterValueChangedHandler)
    //   onFilterValueChangedHandler(
    //     Field.FieldValue,
    //     event.target.value,
    //     event,
    //     params
    //   )
    // onChangeHandler(event.target.value)
  }
  return (
    <div className="textbox">
      {Field.className === 'Formviwer' ? (
        <span className="Formviwer-Label"> {Field && Field.FieldLabel}</span>
      ) : (
        ''
      )}
      <TextField
        id={
          Screen
            ? `txt_${
                Screen + (Field && Field.FieldValue ? Field.FieldValue : id)
              }`
            : id
        }
        multiline={Field?.Multiline ? Field.Multiline : false}
        rows={Field?.Rows ? Field.Rows : null}
        // label={Field && Field.FieldLabel}
        // placeholder={Field && Field.Placeholder}
        // variant={variant || 'filled'}
        label={
          Field.className === 'Formviwer'
            ? 'standard'
            : Field && Field.FieldLabel
        }
        // placeholder={Field && Field.Placeholder}
        variant={
          Field.className === 'Formviwer' ? 'standard' : variant || 'filled'
        }
        type={(Field.Type && Field.Type) || 'text'}
        value={value && value}
        className={`${Field.className} ${cssClass}`}
        inputProps={{
          maxLength: Length,
          CSSClass: (Field && Field.ClassName) || '',
          pattern: '[0-9]*',
          onDrop: (event) => {
            if (Field?.DisableDroppable) event.preventDefault()
          },
        }}
        defaultValue={Field && Field.DefaultValue}
        fieldValue={Field && Field.FieldValue}
        required={Field?.Validation && Field.Validation.IsRequired}
        error={isErrorClass === 'false' ? '' : ' '}
        onChange={(event) => {
          onChange(event)
        }}
        disabled={Field?.Disabled}
        size="small"
        {...rest}
      />
      {Field && Field.IsEnableHelpText && Field.IsEnableHelpText === true && (
        <FFHelpText LongText={Field.HelpText} />
      )}

      {validatormessage && (
        <span className="error">
          <br />
          {validatormessage}
        </span>
      )}
    </div>
  )
}

FFTextBox.propTypes = {
  Field: PropTypes.objectOf(PropTypes.any).isRequired,
  cssClass: PropTypes.string,
  className: PropTypes.string,
  onChangeHandler: PropTypes.func,
  onFilterValueChangedHandler: PropTypes.func,
  OnFieldValidation: PropTypes.func,
  value: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.string,
  Length: PropTypes.string,
  forceFieldValidation: PropTypes.bool.isRequired,
  Screen: PropTypes.string,
}

FFTextBox.defaultProps = {
  cssClass: '',
  className: '',
  onChangeHandler: () => null,
  onFilterValueChangedHandler: () => null,
  OnFieldValidation: () => null,
  value: '',
  id: '',
  error: '',
  type: '',
  required: '',
  Length: '',
  Screen: '',
}

export default FFTextBox
