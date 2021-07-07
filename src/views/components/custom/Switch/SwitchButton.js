import React, { Fragment } from 'react'
import Switch from '@material-ui/core/Switch'
import './SwitchButton.css'

const SwitchButton = ({
  name,
  CSSClass,
  checked,
  Field,
  onSwitchhandler,
  Disabled,
}) => {
  function onChange(event) {
    // Field.IsView = !Field.IsView
    // Field.FieldValue = !Field.FieldValue
    checked = !checked
    onSwitchhandler(event, checked)
  }

  return (
    <>
      <span className={`Switch__header ${CSSClass}`}>
        {Field && Field.FieldLabel}
      </span>
      <Switch
        name={name}
        className="primarycolor"
        // onChange={() => {
        //   Field.IsView = !Field.IsView
        // }}
        onChange={(event) => {
          onChange(event)
        }}
        checked={checked && checked} // ? Field.FieldValue}
        onClick={(event) => event.stopPropagation()}
        className="switchbutton"
        inputProps={{ 'aria-label': 'checkbox' }}
        disabled={Disabled}
      />
    </>
  )
}

Switch.propTypes = {}

Switch.defaultProps = {}

export default SwitchButton
