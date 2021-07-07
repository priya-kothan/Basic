import React, { useState, forwardRef, useImperativeHandle } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { format, isValid } from 'date-fns'
import * as moment from 'moment'

const DateEditor = forwardRef((props, ref) => {
  const [selectedDate, setSelectedDate] = useState(null)

  function handleDateChange(d) {
    if (d) {
      d.setHours(0, 0, 0, 0)
    }
    setSelectedDate(d)
  }

  useImperativeHandle(ref, () => {
    return {
      getValue: () => {
        let dateString = null
        if (selectedDate && isValid(selectedDate)) {
          dateString = format(new Date(selectedDate), props.requestDateFormat)
        }
        return dateString
      },
      isCancelAfterEnd: () => {
        return !selectedDate
      },
      afterGuiAttached: () => {
        if (!props.value) {
          return
        }

        // const selectedDate = new Date(props.value)
        const selectedDate = moment(props.value, 'yyyy-DD-MM').format(
          'MM/DD/yyyy'
        )

        setSelectedDate(selectedDate)

        // const inputRef = document.getElementById(
        //   `date-picker-dialog-${props.column.colId}`
        // )
        // inputRef.focus()
        // inputRef.select()
      },
      focusIn: () => {
        const inputRef = document.getElementById(
          `date-picker-dialog-${props.column.colId}`
        )
        inputRef.focus()
        inputRef.select()
      },
    }
  })

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        style={{ margin: 0 }}
        margin="normal"
        id={`date-picker-dialog-${props.column.colId}`}
        format={props.format || 'MM/dd/yyyy'}
        value={selectedDate}
        onChange={handleDateChange}
        variant="inline"
        disableToolbar
        placeholder={`Enter ${props.column.colId}`}
      />
    </MuiPickersUtilsProvider>
  )
})

export default DateEditor
