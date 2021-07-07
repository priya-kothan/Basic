import FormControl from '@material-ui/core/FormControl'
import React from 'react'
import FFButton from '../../../base/FFButton/FFButton'

const ActionElement = ({ className, handleOnClick, label, title }) => (
  <FormControl className={className}>
    <FFButton
      size="small"
      title={title}
      Field={{
        FieldValue: label,
        Variant: 'contained',
        FieldLabel: label,
        Type: 'primary',
      }}
      // className={className}
      onClickHandler={(e) => handleOnClick(e)}
    />
  </FormControl>
)
ActionElement.displayName = 'ActionElement'
export default ActionElement
