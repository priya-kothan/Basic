import React from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { isValid, format, parse } from 'date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'

import './FFDatepicker.css'

export const FFdatePicker = ({
  label,
  value,
  disableflag,
  maxValue,
  minValue,
  CSSClass,
  Field,
  onClickHandler,
  onChangeHandler,
  onFilterValueChangedHandler,
  variant,
}) => {
  const onChange = (dateValue, dateText, fieldValue) => {
    let formattedDate = null
    if (dateValue && isValid(dateValue)) {
      dateValue.setHours(0, 0, 0, 0)

      formattedDate = format(dateValue, 'yyyy-dd-MM HH:mm:ss')
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
    <div className="datetimepickers">
      {Field.className === 'Formviwer' ? (
        <div className="Formviwer-Label"> {Field && Field.FieldLabel}</div>
      ) : (
        ''
      )}
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          inputVariant={variant || 'filled'}
          format={Field.DateFormat || 'MM/dd/yyyy'}
          invalidLabel=""
          invalidDateMessage=""
          InputProps={{ disableUnderline: true }}
          InputLabelProps={{ shrink: true }}
          className={`FFdatepicker_root ${CSSClass} ${
            Field.className && Field.className
          }`}
          value={
            value ? parse(value, 'yyyy-dd-MM HH:mm:ss', new Date()) : new Date()
          }
          label={
            Field.className === 'Formviwer' ? '' : Field && Field.FieldLabel
          }
          onChange={(date, value) => onChange(date, value, Field.FieldValue)}
          disabled={disableflag || Field?.Disabled}
        />
      </MuiPickersUtilsProvider>
    </div>
  )
}

export default FFdatePicker
