import React from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { isValid, format, parse } from 'date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers'
import './FFDateTimepicker.css'

const FFDateTimepicker = ({
  name,
  Field,
  onChangeHandler,
  value,
  onClickHandler,
  variant,
  CSSClass,
  onFilterValueChangedHandler,
  disableflag,
}) => {
  const onChange = (date, fieldValue) => {
    let formattedDate = null

    if (date && isValid(date)) {
      formattedDate = format(date, 'yyyy-dd-MM HH:mm:ss')
      if (onFilterValueChangedHandler)
        onFilterValueChangedHandler(fieldValue, formattedDate)
      if (onClickHandler) onClickHandler(fieldValue, formattedDate)
      if (onChangeHandler)
        onChangeHandler(null, {
          id: fieldValue,
          value: formattedDate,
        })
    }
  }

  return (
    <div className="dateandtimepickers">
      {Field.className === 'Formviwer' ? (
        <div className="Formviwer-Label"> {Field && Field.FieldLabel}</div>
      ) : (
        ''
      )}
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDateTimePicker
          disableToolbar
          name={name}
          label={
            Field.className === 'Formviwer' ? '' : Field && Field.FieldLabel
          }
          format={Field.DateFormat || 'yyyy-dd-MM HH:mm:ss'}
          onChange={(date) => onChange(date, Field.FieldValue)}
          className={`FFDateandTimePicker_root ${CSSClass} ${
            Field.className && Field.className
          }`}
          value={
            value ? parse(value, 'yyyy-dd-MM HH:mm:ss', new Date()) : null // new Date()
          }
          variant="inline"
          inputVariant={variant || 'filled'}
          InputProps={{
            disableUnderline: true,
          }}
          InputLabelProps={{ shrink: true }}
          invalidLabel=""
          invalidDateMessage=""
          disabled={disableflag || Field?.Disabled}
        />
      </MuiPickersUtilsProvider>
    </div>
  )
}

export default FFDateTimepicker
