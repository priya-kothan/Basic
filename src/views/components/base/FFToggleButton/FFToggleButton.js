import React, { Fragment } from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import './FFToggleButton.css'
import FFHelpText from '../FFHelpText/FFHelpText'
import FFFormlogo from '../FFFormlogo/FFFormlogo'

export const FFToggleButton = ({
  id,
  value,
  CSSClass,
  onChangeHandler,
  Field,
  onFilterValueChangedHandler,
  Screen,
  showtext,
  ...rest
}) => {
  const [selectedValue, setselectedValue] = React.useState(Field.DefaultValue)
  const handleSelectedValue = (event, newValue, fieldValue) => {
    if (newValue !== null) {
      setselectedValue(newValue)
    }
    if (onChangeHandler) onChangeHandler(event)
    if (onFilterValueChangedHandler)
      onFilterValueChangedHandler(fieldValue, newValue, event)
  }
  return (
    <>
      <div className={`MuiToggleButton-Tooltip_root  ${CSSClass}`}>
        <ToggleButtonGroup
          id={id}
          value={selectedValue}
          defaultValue={Field.DefaultValue}
          fieldvalue={Field.FieldValue}
          exclusive
          onChange={(event, selectedValue) =>
            handleSelectedValue(event, selectedValue, Field.FieldValue)
          }
          className={`FFToggleButton_root ${Field.CSSClass && Field.CSSClass}`}
          aria-label="Toggle Button"
        >
          {Field.DataSource &&
            Field.DataSource.map((item, index) => {
              return (
                <ToggleButton
                  key={index}
                  aria-label="left aligned"
                  fieldvalue={Field.FieldValue}
                  value={item.Id}
                  id={Screen ? `${Screen}_Toggle_${item.Id}` : item.Id}
                  className={`FFtoggle ${
                    Screen ? `${Screen}_Toggle_${item.Id}` : item.Id
                  }`}
                  index={index}
                >
                  <div className="searchbox__icon">
                    <FFFormlogo imagename={item.Id} />
                  </div>
                  &nbsp; &nbsp;{' '}
                  {showtext === true
                    ? item.Name
                    : item.Name === selectedValue
                    ? item.Name
                    : ''}
                </ToggleButton>
              )
            })}
        </ToggleButtonGroup>
        {Field.IsEnableHelpText !== 'undefined' &&
          Field.IsEnableHelpText === true && (
            <div className="MuiToggleButton-Tooltip">
              <FFHelpText LongText={Field.HelpText} />
            </div>
          )}
      </div>
    </>
  )
}

export default FFToggleButton
