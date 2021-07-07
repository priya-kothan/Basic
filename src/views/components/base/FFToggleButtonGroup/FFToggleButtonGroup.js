import React from 'react'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

const FFToggleButtonGroup = (props) => {
  return (
    <ToggleButtonGroup
      size={props.size}
      value={props.value}
      className={props.className}
      exclusive
      onChange={props.onChangeHandler}
    >
      {props.Buttons}
    </ToggleButtonGroup>
  )
}

export default FFToggleButtonGroup
