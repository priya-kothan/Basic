import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'
import FFTextBox from '../../../base/FFTextBox/FFTextBox'
import FFButton from '../../../base/FFButton/FFButton'
import './OptionSetOption.css'
import useAppContext from '../../../hooks/useToast'

const OptionSetOption = ({ addOptions }) => {
  const initialFValues = {
    Name: '',
    Value: '',
  }
  const { showToastMessage, showLoading } = useAppContext()
  const [OptionSetOptionvalues, setOptionSetOptionvalues] =
    useState(initialFValues)
  const clearHandlechange = () => {
    setOptionSetOptionvalues(initialFValues)
  }
  const handlechange = () => {
    showLoading(true)
    if (
      OptionSetOptionvalues.Name !== '' &&
      OptionSetOptionvalues.Value !== ''
    ) {
      addOptions(OptionSetOptionvalues, clearHandlechange)
    } else if (
      OptionSetOptionvalues.Name === '' &&
      OptionSetOptionvalues.Value === ''
    ) {
      showToastMessage(
        'Options Name and Value field should not be empty',
        'error'
      )
    } else if (OptionSetOptionvalues.Name === '') {
      showToastMessage('Options Name field should not be empty', 'error')
    } else if (OptionSetOptionvalues.Value === '') {
      showToastMessage('Options Value field should not be empty', 'error')
    }
    showLoading(false)
  }

  return (
    <>
      {/* <Grid item xs={12}> */}
      <FFTextBox
        name="Name"
        label="Name"
        value={OptionSetOptionvalues.Name}
        className="AddField"
        onChange={(e) =>
          setOptionSetOptionvalues({
            ...OptionSetOptionvalues,
            Name: e.target.value,
          })
        }
        Field={{
          FieldValue: 'Name',
          FieldLabel: 'Name',
          Validation: { IsRequired: 'False' },
        }}
        Screen="OptionSetOption"
      />
      {/* </Grid>
      <Grid item xs={12}> */}
      <FFTextBox
        name="Value"
        label="Value"
        value={OptionSetOptionvalues.Value}
        className="AddField"
        onChange={(e) =>
          setOptionSetOptionvalues({
            ...OptionSetOptionvalues,
            Value: e.target.value,
          })
        }
        Field={{
          FieldValue: 'Value',
          FieldLabel: 'Name',
          Validation: { IsRequired: 'False' },
        }}
        Screen="OptionSetOption"
      />
      {/* </Grid>
      <Grid> */}
      {/* <div className="OptionSet_ChildSubmit">
        <div className="OptionSet_ItemesAdd"> */}
      <div className="OptionSet_AddItemes">
        <FFButton
          Field={{
            FieldValue: 'OptionSet_btnAdd',
            Variant: 'contained',
            FieldLabel: 'Add',
            Type: 'primary',
            Disabled:
              (OptionSetOptionvalues &&
                OptionSetOptionvalues.Name === undefined) ||
              OptionSetOptionvalues.Name.trim() === '' ||
              OptionSetOptionvalues.Value === undefined ||
              OptionSetOptionvalues.Value.trim() === '',
          }}
          className="OptionSet_btnAdd"
          onClickHandler={handlechange}
        />
        {/* </div>
        <div className="OptionSet_ItemesClear"> */}
        <FFButton
          Field={{
            FieldValue: 'OptionSet_btnClear',
            Variant: 'contained',
            FieldLabel: 'Clear',
            Type: 'secondary',
          }}
          className="OptionSet_btnClear"
          onClickHandler={clearHandlechange}
        />
      </div>
      {/* </div>
      </div> */}
      {/* </Grid> */}
    </>
  )
}

OptionSetOption.propTypes = {
  addOptions: PropTypes.func,
}

OptionSetOption.defaultProps = {
  addOptions: () => null,
}

export default OptionSetOption
