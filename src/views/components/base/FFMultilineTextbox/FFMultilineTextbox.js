import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import './FFMultilineTextbox.css'
import PropTypes from 'prop-types'
import FFHelpText from '../FFHelpText/FFHelpText'
import getValidator from '../FFValidator/Validator'

const FFMultilineTextbox = ({
  Field,
  id,
  onChangeHandler,
  OnFieldValidation,
  forceFieldValidation,
  cssClass,
  className,
  label,
  variant,
  name,
  value,
  Screen,
}) => {
  const [validatormessage, setvalidatormessage] = useState(null)
  const [isErrorClass, setErrorClass] = useState('false')

  function submitvalidation() {
    let ValidationisVaild = true
    // eslint-disable-next-line no-undef
    const textboxdata = $(`#${Field.FieldValue}`).val()
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
        setErrorClass('true')
        if (Field.Validation.ValidationText !== null) {
          isVaild = Field.Validation.ValidationText
        }
        setvalidatormessage(isVaild)
        ValidationisVaild = false
      } else {
        setErrorClass('false')
        setvalidatormessage('')
        ValidationisVaild = true
      }
      const params = { id: Field.FieldValue, isValidData: ValidationisVaild }
      if (OnFieldValidation) OnFieldValidation(params)
    }
  }

  // useEffect(() => {
  //   if (forceFieldValidation === true) submitvalidation()
  // }, [])

  function onChange(event) {
    // let ValidationisVaild = false
    const eventdata = event
    // const textboxdata =
    //   typeof event.target === 'undefined' || event.target === 'undefined'
    //     ? event
    //     : event.target.value
    // if (Field.Validation && Field.Validation.ValidationCondition !== '') {
    //   const validatorfunction = getValidator(
    //     Field.Validation.ValidationCondition
    //   )
    //   let isVaild = validatorfunction(textboxdata)
    //   if (isVaild !== '') {
    //     setErrorClass('true')
    //     if (Field.Validation.ValidationText !== null) {
    //       isVaild = Field.Validation.ValidationText
    //     }
    //     setvalidatormessage(isVaild)
    //     ValidationisVaild = false
    //   } else {
    //     setErrorClass('false')
    //     setvalidatormessage('')
    //     ValidationisVaild = true
    //   }
    // }
    const params = { eventdata }
    if (onChangeHandler) onChangeHandler(eventdata, params)
  }
  return (
    <div
      className={`FFMultilineTextbox-root ${className}`}
      spellCheck={Field.IsEnableSpellCheck === true ? 'true' : 'false'}
    >
      <TextField
        label={label}
        multiline
        rows={Field.Rows}
        data-shrink="true"
        placeholder={Field.Placeholder}
        defaultValue={Field.DefaultValue}
        variant={variant === 'filled' ? 'filled' : 'outlined'}
        // onChange={onChange}
        className={`${className} ${cssClass}`}
        value={value}
        // required={
        //   Field && Field.Validation && Field.Validation.IsRequired === 'False'
        //     ? ''
        //     : ' '
        // }
        id={
          Screen
            ? `txt_${
                Screen + (Field && Field.FieldValue ? Field.FieldValue : id)
              }`
            : id
        }
        name={name}
        error={isErrorClass === 'false' ? '' : ' '}
        onChange={(event) => {
          onChange(event)
        }}
      />
      {Field &&
        Field.IsEnableHelpText !== 'undefined' &&
        Field.IsEnableHelpText === true && (
          <FFHelpText LongText={Field.HelpText} />
        )}
      <span className="error">{validatormessage}</span>
    </div>
  )
}

FFMultilineTextbox.propTypes = {
  Field: PropTypes.objectOf(PropTypes.any),
  id: PropTypes.string,
  onChangeHandler: PropTypes.func,
  OnFieldValidation: PropTypes.func,
  forceFieldValidation: PropTypes.bool,
  cssClass: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  Screen: PropTypes.string,
}
FFMultilineTextbox.defaultProps = {
  Field: {},
  id: null,
  onChangeHandler: () => null,
  OnFieldValidation: () => null,
  forceFieldValidation: false,
  cssClass: null,
  className: null,
  name: null,
  value: null,
  Screen: null,
}

export default FFMultilineTextbox
