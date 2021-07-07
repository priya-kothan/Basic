import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { TextField } from '@material-ui/core'

const NumericEditor = forwardRef((props, ref) => {
  const inputRef = useRef()
  const [value, setValue] = useState(null)

  function inputHandler(e) {
    setValue(e.target.value)
  }

  React.useEffect(() => {
    inputRef.current.addEventListener('keypress', function (event) {
      const keycode = event.which
      if (
        !(
          event.shiftKey == false &&
          (keycode == 46 ||
            keycode == 8 ||
            keycode == 37 ||
            keycode == 39 ||
            (keycode >= 48 && keycode <= 57))
        )
      ) {
        event.preventDefault()
      }
    })
  }, [value])

  useImperativeHandle(ref, () => {
    return {
      getValue: () => {
        if (!value || Number.isNaN(value)) return 0
        return parseFloat(value)
      },
      afterGuiAttached: () => {
        setValue(props.value)
        // inputRef.current.focus()
        // inputRef.current.select()
      },
      focusIn: () => {
        inputRef.current.focus()
        inputRef.current.select()
      },
    }
  })

  return (
    <TextField
      type="number"
      className="ag-input-field-input ag-text-field-input"
      ref={inputRef}
      onChange={inputHandler}
      value={value}
      placeholder={`Enter ${props.column.colId}`}
    />
  )
})

export default NumericEditor
