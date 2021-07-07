import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { TextField } from '@material-ui/core'

const TextEditor = forwardRef((props, ref) => {
  const inputRef = useRef()
  const [value, setValue] = useState('')

  function inputHandler(e) {
    setValue(e.target.value)
  }

  useImperativeHandle(ref, () => {
    return {
      getValue: () => {
        return value
      },
      afterGuiAttached: () => {
        setValue(props.value)
      },
      focusIn: () => {
        inputRef.current.focus()
        inputRef.current.select()
      },
    }
  })

  return (
    <TextField
      type="text"
      className="ag-input-field-input ag-text-field-input"
      ref={inputRef}
      onChange={inputHandler}
      value={value}
      placeholder={`Enter ${props.column.colId}`}
    />
  )
})

export default TextEditor
